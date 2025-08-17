import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sobre */}
          <div>
            <h3 className="font-bold text-lg mb-4">Reclama Golpe</h3>
            <p className="text-gray-400 text-sm">
              Plataforma colaborativa para denunciar e prevenir golpes online.
              Juntos somos mais fortes contra fraudes.
            </p>
          </div>

          {/* Links Rápidos */}
          <div>
            <h4 className="font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/golpes" className="hover:text-white transition-colors">
                  Últimos Golpes
                </Link>
              </li>
              <li>
                <Link href="/trending" className="hover:text-white transition-colors">
                  Mais Denunciados
                </Link>
              </li>
              <li>
                <Link href="/denunciar" className="hover:text-white transition-colors">
                  Denunciar Golpe
                </Link>
              </li>
              <li>
                <Link href="/dicas" className="hover:text-white transition-colors">
                  Dicas de Segurança
                </Link>
              </li>
            </ul>
          </div>

          {/* Categorias */}
          <div>
            <h4 className="font-semibold mb-4">Categorias</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link href="/categoria/phishing" className="hover:text-white transition-colors">
                  Phishing
                </Link>
              </li>
              <li>
                <Link href="/categoria/ecommerce" className="hover:text-white transition-colors">
                  E-commerce Falso
                </Link>
              </li>
              <li>
                <Link href="/categoria/piramide" className="hover:text-white transition-colors">
                  Pirâmide Financeira
                </Link>
              </li>
              <li>
                <Link href="/categoria/crypto" className="hover:text-white transition-colors">
                  Criptomoedas
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="font-semibold mb-4">Contato</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>contato@reclamagolpe.com.br</li>
              <li>
                <Link href="/termos" className="hover:text-white transition-colors">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="/privacidade" className="hover:text-white transition-colors">
                  Política de Privacidade
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>© 2024 Reclama Golpe. Todos os direitos reservados.</p>
          <p className="mt-2">
            Desenvolvido com ❤️ para proteger os brasileiros de golpes online
          </p>
        </div>
      </div>
    </footer>
  )
}