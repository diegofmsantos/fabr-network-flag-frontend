import React, { useState } from 'react';
import { Upload, FileText, Check, AlertTriangle } from 'lucide-react';

const AdminUploadForm = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    id_jogo: '',
    data_jogo: '',
    tipo: 'times' // times, jogadores, estatisticas, reprocessar
  });
  
  // Base URL da API - ajuste para o endereço correto do seu backend
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
 const getUploadEndpoint = () => {
  // Remova o /api/ duplicado aqui
  switch (formData.tipo) {
    case 'times': return `${API_BASE_URL}/importar-times`; // Note a remoção de /api/
    case 'jogadores': return `${API_BASE_URL}/importar-jogadores`;
    case 'estatisticas': return `${API_BASE_URL}/atualizar-estatisticas`;
    case 'reprocessar': return `${API_BASE_URL}/reprocessar-jogo`;
    default: return `${API_BASE_URL}/importar-times`;
  }
};
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError('Selecione um arquivo para upload');
      return;
    }
    
    if (formData.tipo === 'estatisticas' || formData.tipo === 'reprocessar') {
      if (!formData.id_jogo.trim()) {
        setError('O ID do jogo é obrigatório');
        return;
      }
      if (!formData.data_jogo.trim()) {
        setError('A data do jogo é obrigatória');
        return;
      }
    }
    
    try {
      setUploading(true);
      setError(null);
      setResult(null);
      
      const formDataObj = new FormData();
      formDataObj.append('arquivo', selectedFile);
      
      // Adiciona dados extras para estatísticas de jogo
      if (formData.tipo === 'estatisticas' || formData.tipo === 'reprocessar') {
        formDataObj.append('id_jogo', formData.id_jogo);
        formDataObj.append('data_jogo', formData.data_jogo);
      }
      
      // Log do endpoint que está sendo chamado
      console.log('Enviando para:', getUploadEndpoint());
      
      const response = await fetch(getUploadEndpoint(), {
        method: 'POST',
        body: formDataObj,
      });
      
      console.log('Status da resposta:', response.status);
      console.log('Headers da resposta:', response.headers);
      
      // Verifique o tipo de conteúdo da resposta
      const contentType = response.headers.get('content-type');
      console.log('Tipo de conteúdo:', contentType);
      
      let responseData;
      if (contentType && contentType.includes('application/json')) {
        // Se for JSON, faça o parse normalmente
        responseData = await response.json();
      } else {
        // Se não for JSON, trate como texto e mostre o erro
        const text = await response.text();
        console.error('Resposta não-JSON recebida:', text.substring(0, 500) + '...');
        throw new Error('Resposta do servidor não é um JSON válido');
      }
      
      if (!response.ok) {
        throw new Error(responseData.error || `Erro ao fazer upload: ${response.status}`);
      }
      
      setResult(responseData);
      setSelectedFile(null);
      // Resetar o input de arquivo
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer upload');
      console.error('Erro:', err);
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Upload de Planilhas</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
          <AlertTriangle size={20} className="mr-2" />
          {error}
        </div>
      )}
      
      {result && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4 flex items-center">
          <Check size={20} className="mr-2" />
          <div>
            <p className="font-bold">{result.mensagem}</p>
            {result.erros && result.erros.length > 0 && (
              <p className="text-xs mt-1">Com {result.erros.length} erros. Verifique o console para detalhes.</p>
            )}
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Planilha
          </label>
          <select
            name="tipo"
            value={formData.tipo}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="times">Times</option>
            <option value="jogadores">Jogadores</option>
            <option value="estatisticas">Estatísticas de Jogo</option>
            <option value="reprocessar">Reprocessar Jogo</option>
          </select>
        </div>
        
        {(formData.tipo === 'estatisticas' || formData.tipo === 'reprocessar') && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID do Jogo
              </label>
              <input
                type="text"
                name="id_jogo"
                value={formData.id_jogo}
                onChange={handleInputChange}
                placeholder="Ex: jogo_001"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data do Jogo
              </label>
              <input
                type="date"
                name="data_jogo"
                value={formData.data_jogo}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </>
        )}
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center" 
             style={{ background: selectedFile ? '#f0f9ff' : 'white' }}>
          <input
            id="file-input"
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="hidden"
          />
          <label htmlFor="file-input" className="cursor-pointer">
            <div className="flex flex-col items-center justify-center gap-2">
              <FileText size={48} className="text-blue-500" />
              {selectedFile ? (
                <span className="font-medium text-blue-600">{selectedFile.name}</span>
              ) : (
                <span className="text-gray-500">
                  Clique para selecionar uma planilha Excel
                </span>
              )}
              <span className="text-xs text-gray-400">
                (.xlsx, .xls)
              </span>
            </div>
          </label>
        </div>
        
        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center"
        >
          {uploading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processando...
            </>
          ) : (
            <>
              <Upload size={20} className="mr-2" />
              Enviar Planilha
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AdminUploadForm;