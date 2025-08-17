export default function TermosPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Termos de Uso</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          <section>
            <p className="text-sm text-gray-600 mb-6">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
            
            <p className="text-gray-700 leading-relaxed mb-6">
              Bem-vindo ao Reclama Golpe. Ao utilizar nossa plataforma, você concorda com os 
              termos e condições estabelecidos abaixo. Leia atentamente antes de usar nossos serviços.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Aceitação dos Termos</h2>
            <p className="text-gray-700 leading-relaxed">
              Ao acessar e usar o Reclama Golpe, você aceita e concorda em cumprir estes Termos de Uso 
              e todas as leis e regulamentos aplicáveis. Se você não concordar com algum destes termos, 
              está proibido de usar ou acessar este site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Uso da Plataforma</h2>
            <div className="space-y-3 text-gray-700">
              <p className="leading-relaxed">O Reclama Golpe é uma plataforma colaborativa para:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Compartilhar experiências sobre golpes e fraudes online</li>
                <li>Alertar outros usuários sobre práticas fraudulentas</li>
                <li>Buscar informações sobre possíveis golpes</li>
                <li>Contribuir para uma internet mais segura</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Cadastro e Conta</h2>
            <div className="space-y-3 text-gray-700">
              <p>Ao criar uma conta, você:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Fornece informações verdadeiras, precisas e completas</li>
                <li>Mantém a segurança de sua senha e conta</li>
                <li>É responsável por todas as atividades em sua conta</li>
                <li>Notifica imediatamente sobre uso não autorizado</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Conteúdo do Usuário</h2>
            <div className="space-y-3 text-gray-700">
              <p className="leading-relaxed"><strong>4.1 Responsabilidade:</strong></p>
              <p>Você é inteiramente responsável pelo conteúdo que publica, incluindo denúncias, 
                 comentários e qualquer outra informação compartilhada na plataforma.</p>
              
              <p className="leading-relaxed mt-4"><strong>4.2 Veracidade:</strong></p>
              <p>Você garante que todas as informações fornecidas são verdadeiras e baseadas em 
                 experiências reais. Denúncias falsas podem resultar em consequências legais.</p>
              
              <p className="leading-relaxed mt-4"><strong>4.3 Proibições:</strong></p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Publicar conteúdo falso, difamatório ou caluniador</li>
                <li>Violar direitos de propriedade intelectual</li>
                <li>Compartilhar informações pessoais de terceiros sem consentimento</li>
                <li>Usar linguagem ofensiva, discriminatória ou inadequada</li>
                <li>Fazer spam ou publicidade não autorizada</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Moderação</h2>
            <p className="text-gray-700 leading-relaxed">
              Reservamo-nos o direito de revisar, editar ou remover qualquer conteúdo que viole 
              estes termos. Todas as denúncias passam por um processo de moderação antes da publicação. 
              Podemos suspender ou encerrar contas que violem repetidamente nossos termos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Direito de Resposta</h2>
            <p className="text-gray-700 leading-relaxed">
              Empresas ou indivíduos mencionados em denúncias têm direito de resposta. 
              Providenciaremos mecanismos para contestação de informações incorretas, 
              seguindo os princípios de transparência e justiça.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Privacidade</h2>
            <p className="text-gray-700 leading-relaxed">
              O uso de suas informações pessoais é regido por nossa Política de Privacidade. 
              Ao usar o Reclama Golpe, você consente com a coleta e uso de informações conforme 
              descrito em nossa política de privacidade.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Isenção de Responsabilidade</h2>
            <div className="space-y-3 text-gray-700">
              <p className="leading-relaxed">
                O Reclama Golpe é uma plataforma de compartilhamento de informações. Não nos 
                responsabilizamos por:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Veracidade absoluta do conteúdo postado por usuários</li>
                <li>Prejuízos decorrentes do uso das informações da plataforma</li>
                <li>Ações tomadas com base em denúncias publicadas</li>
                <li>Conteúdo de sites externos linkados na plataforma</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Propriedade Intelectual</h2>
            <p className="text-gray-700 leading-relaxed">
              Todo o conteúdo original do Reclama Golpe, incluindo textos, gráficos, logos, 
              ícones e software, é propriedade do Reclama Golpe e está protegido por leis de 
              direitos autorais e propriedade intelectual.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Limitação de Responsabilidade</h2>
            <p className="text-gray-700 leading-relaxed">
              Em nenhuma circunstância o Reclama Golpe será responsável por danos diretos, 
              indiretos, incidentais, especiais ou consequenciais resultantes do uso ou 
              incapacidade de usar a plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Alterações nos Termos</h2>
            <p className="text-gray-700 leading-relaxed">
              Podemos revisar estes termos a qualquer momento. As alterações entram em vigor 
              imediatamente após a publicação. O uso contínuo da plataforma após alterações 
              constitui aceitação dos novos termos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Lei Aplicável</h2>
            <p className="text-gray-700 leading-relaxed">
              Estes termos são regidos pelas leis brasileiras. Qualquer disputa relacionada a 
              estes termos será resolvida nos tribunais brasileiros competentes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contato</h2>
            <p className="text-gray-700 leading-relaxed">
              Para dúvidas sobre estes Termos de Uso, entre em contato através de:
            </p>
            <div className="mt-3 p-4 bg-gray-50 rounded">
              <p className="text-gray-700">
                E-mail: contato@reclamagolpe.com.br<br />
                Horário de atendimento: Segunda a Sexta, 9h às 18h
              </p>
            </div>
          </section>

          <section className="pt-6 border-t border-gray-200">
            <p className="text-center text-gray-600">
              Ao continuar usando o Reclama Golpe, você confirma que leu, entendeu e 
              concordou com estes Termos de Uso.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}