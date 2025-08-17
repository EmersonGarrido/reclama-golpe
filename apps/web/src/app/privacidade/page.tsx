export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Política de Privacidade</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          <section>
            <p className="text-sm text-gray-600 mb-6">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
            
            <p className="text-gray-700 leading-relaxed mb-6">
              O Reclama Golpe está comprometido com a proteção de sua privacidade. Esta Política 
              de Privacidade explica como coletamos, usamos, compartilhamos e protegemos suas 
              informações pessoais quando você usa nossa plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Informações que Coletamos</h2>
            
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold mb-2">1.1 Informações Fornecidas por Você:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Nome completo e e-mail (ao criar conta)</li>
                  <li>Informações de denúncias (descrição, valores, datas)</li>
                  <li>Comentários e interações na plataforma</li>
                  <li>Documentos ou evidências compartilhadas voluntariamente</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">1.2 Informações Coletadas Automaticamente:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Endereço IP e localização aproximada</li>
                  <li>Tipo de navegador e sistema operacional</li>
                  <li>Páginas visitadas e tempo de permanência</li>
                  <li>Data e horário de acesso</li>
                  <li>Cookies e tecnologias similares</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Como Usamos suas Informações</h2>
            <div className="space-y-3 text-gray-700">
              <p>Utilizamos suas informações para:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Fornecer e melhorar nossos serviços</li>
                <li>Processar e moderar denúncias</li>
                <li>Enviar notificações sobre sua conta e atividades</li>
                <li>Responder a dúvidas e fornecer suporte</li>
                <li>Prevenir fraudes e atividades ilegais</li>
                <li>Gerar estatísticas agregadas (sem identificação pessoal)</li>
                <li>Cumprir obrigações legais</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Compartilhamento de Informações</h2>
            <div className="space-y-4 text-gray-700">
              <p className="leading-relaxed">
                <strong>3.1 Conteúdo Público:</strong> Denúncias e comentários são públicos por natureza 
                da plataforma. Não compartilhe informações sensíveis que não deseja tornar públicas.
              </p>
              
              <p className="leading-relaxed">
                <strong>3.2 Não Vendemos Dados:</strong> Nunca vendemos, alugamos ou comercializamos 
                suas informações pessoais.
              </p>
              
              <p className="leading-relaxed">
                <strong>3.3 Compartilhamento Limitado:</strong> Podemos compartilhar informações apenas:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Com seu consentimento explícito</li>
                <li>Para cumprir obrigações legais ou ordens judiciais</li>
                <li>Para proteger direitos, propriedade ou segurança</li>
                <li>Com prestadores de serviço (sob acordos de confidencialidade)</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Cookies e Tecnologias Similares</h2>
            <div className="space-y-3 text-gray-700">
              <p>Utilizamos cookies para:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Manter você conectado à sua conta</li>
                <li>Lembrar suas preferências</li>
                <li>Analisar o uso da plataforma</li>
                <li>Melhorar a experiência do usuário</li>
              </ul>
              <p className="mt-3">
                Você pode controlar cookies através das configurações do seu navegador, mas 
                isso pode afetar a funcionalidade da plataforma.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Segurança dos Dados</h2>
            <p className="text-gray-700 leading-relaxed">
              Implementamos medidas técnicas e organizacionais para proteger suas informações, incluindo:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-3">
              <li>Criptografia de dados em trânsito (HTTPS)</li>
              <li>Senhas armazenadas com hash seguro</li>
              <li>Acesso restrito a dados pessoais</li>
              <li>Monitoramento de segurança contínuo</li>
              <li>Backups regulares</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Seus Direitos (LGPD)</h2>
            <div className="space-y-3 text-gray-700">
              <p>De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem direito a:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Acesso:</strong> Solicitar cópia dos seus dados pessoais</li>
                <li><strong>Correção:</strong> Corrigir dados incorretos ou desatualizados</li>
                <li><strong>Exclusão:</strong> Solicitar a exclusão dos seus dados</li>
                <li><strong>Portabilidade:</strong> Receber seus dados em formato estruturado</li>
                <li><strong>Oposição:</strong> Opor-se a determinados processamentos</li>
                <li><strong>Informação:</strong> Saber como seus dados são tratados</li>
              </ul>
              <p className="mt-3">
                Para exercer seus direitos, entre em contato através de privacidade@reclamagolpe.com.br
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Retenção de Dados</h2>
            <p className="text-gray-700 leading-relaxed">
              Mantemos suas informações pelo tempo necessário para fornecer nossos serviços e 
              cumprir obrigações legais. Denúncias públicas podem ser mantidas indefinidamente 
              para fins históricos e de prevenção. Dados de contas excluídas são removidos em 
              até 90 dias, exceto quando retenção é exigida por lei.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Menores de Idade</h2>
            <p className="text-gray-700 leading-relaxed">
              O Reclama Golpe não é direcionado a menores de 18 anos. Não coletamos 
              intencionalmente informações de menores. Se tomarmos conhecimento de que 
              coletamos dados de um menor, tomaremos medidas para remover essas informações.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Transferência Internacional</h2>
            <p className="text-gray-700 leading-relaxed">
              Seus dados podem ser processados em servidores localizados fora do Brasil. 
              Nesses casos, garantimos que medidas adequadas de proteção sejam implementadas 
              conforme exigido pela LGPD.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Links Externos</h2>
            <p className="text-gray-700 leading-relaxed">
              Nossa plataforma pode conter links para sites externos. Não somos responsáveis 
              pelas práticas de privacidade desses sites. Recomendamos que você leia as 
              políticas de privacidade de cada site que visitar.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Alterações nesta Política</h2>
            <p className="text-gray-700 leading-relaxed">
              Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos 
              sobre mudanças significativas através da plataforma ou por e-mail. O uso 
              continuado após alterações constitui aceitação da política atualizada.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Base Legal para Processamento</h2>
            <div className="space-y-3 text-gray-700">
              <p>Processamos seus dados com base em:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Consentimento (para marketing e comunicações)</li>
                <li>Execução de contrato (fornecer nossos serviços)</li>
                <li>Interesse legítimo (segurança e melhoria da plataforma)</li>
                <li>Obrigação legal (quando exigido por lei)</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Encarregado de Proteção de Dados</h2>
            <div className="p-4 bg-gray-50 rounded">
              <p className="text-gray-700">
                <strong>Encarregado (DPO):</strong> João Silva<br />
                <strong>E-mail:</strong> dpo@reclamagolpe.com.br<br />
                <strong>Endereço:</strong> Rua Example, 123 - São Paulo/SP<br />
                CEP: 01234-567
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Contato</h2>
            <p className="text-gray-700 leading-relaxed">
              Para questões sobre privacidade ou exercer seus direitos:
            </p>
            <div className="mt-3 p-4 bg-gray-50 rounded">
              <p className="text-gray-700">
                <strong>E-mail:</strong> privacidade@reclamagolpe.com.br<br />
                <strong>Telefone:</strong> 0800 123 4567<br />
                <strong>Horário:</strong> Segunda a Sexta, 9h às 18h
              </p>
            </div>
          </section>

          <section className="pt-6 border-t border-gray-200">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-900 font-semibold mb-2">
                Seu direito à privacidade é importante para nós
              </p>
              <p className="text-blue-800 text-sm">
                Estamos comprometidos com a transparência e proteção dos seus dados pessoais. 
                Se tiver dúvidas ou preocupações, não hesite em nos contatar.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}