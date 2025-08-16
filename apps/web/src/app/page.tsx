export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Reclama Golpe
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Denuncie e previna golpes online. Ajude a comunidade a se proteger 
            compartilhando suas experiências.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">🚨 Denuncie</h3>
            <p className="text-gray-600">
              Compartilhe golpes que você identificou ou sofreu
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">🔍 Pesquise</h3>
            <p className="text-gray-600">
              Verifique se uma oferta ou site é confiável
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">💬 Discuta</h3>
            <p className="text-gray-600">
              Comente e ajude outros usuários com informações
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}