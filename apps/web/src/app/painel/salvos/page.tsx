"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isAuthenticated, getUser } from "@/lib/auth";
import { 
  Bookmark, 
  AlertTriangle, 
  Calendar, 
  Eye, 
  MessageCircle,
  Heart,
  BookmarkX
} from "lucide-react";

interface SavedScam {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  createdAt: string;
  savedAt: string;
  views: number;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  _count: {
    comments: number;
    likes: number;
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

export default function SavedScamsPage() {
  const router = useRouter();
  const [savedScams, setSavedScams] = useState<SavedScam[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login?returnUrl=/painel/salvos");
      return;
    }
    fetchSavedScams();
  }, [page, router]);

  const fetchSavedScams = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_URL}/saved-scams?page=${page}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSavedScams(data.data);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error("Erro ao buscar golpes salvos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (scamId: string) => {
    if (!confirm("Deseja remover este golpe dos salvos?")) {
      return;
    }

    setRemovingId(scamId);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/saved-scams/${scamId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setSavedScams(savedScams.filter((scam) => scam.id !== scamId));
      }
    } catch (error) {
      console.error("Erro ao remover golpe dos salvos:", error);
    } finally {
      setRemovingId(null);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      PHISHING: "bg-blue-100 text-blue-800",
      PYRAMID_SCHEME: "bg-purple-100 text-purple-800",
      FAKE_ECOMMERCE: "bg-orange-100 text-orange-800",
      INVESTMENT_FRAUD: "bg-red-100 text-red-800",
      ROMANCE_SCAM: "bg-pink-100 text-pink-800",
      JOB_SCAM: "bg-green-100 text-green-800",
      LOTTERY_SCAM: "bg-yellow-100 text-yellow-800",
      TECH_SUPPORT: "bg-indigo-100 text-indigo-800",
      CRYPTOCURRENCY: "bg-gray-100 text-gray-800",
      OTHER: "bg-gray-100 text-gray-800",
    };
    return colors[category] || colors.OTHER;
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      PHISHING: "Phishing",
      PYRAMID_SCHEME: "Pirâmide",
      FAKE_ECOMMERCE: "E-commerce Falso",
      INVESTMENT_FRAUD: "Fraude de Investimento",
      ROMANCE_SCAM: "Golpe Romântico",
      JOB_SCAM: "Golpe de Emprego",
      LOTTERY_SCAM: "Golpe de Loteria",
      TECH_SUPPORT: "Suporte Técnico",
      CRYPTOCURRENCY: "Criptomoeda",
      OTHER: "Outros",
    };
    return labels[category] || "Outros";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando golpes salvos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Cabeçalho */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Bookmark className="w-6 h-6 text-red-600" />
                Golpes Salvos
              </h1>
              <p className="text-gray-600 mt-1">
                Golpes que você salvou para consultar depois
              </p>
            </div>
            <Link
              href="/painel"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Voltar ao painel
            </Link>
          </div>
        </div>

        {/* Lista de golpes salvos */}
        {savedScams.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <BookmarkX className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhum golpe salvo
            </h2>
            <p className="text-gray-600 mb-6">
              Você ainda não salvou nenhum golpe para consultar depois.
            </p>
            <Link
              href="/golpes"
              className="inline-block bg-red-600 text-white px-6 py-2.5 rounded-lg hover:bg-red-700 transition-colors font-semibold"
            >
              Explorar Golpes
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {savedScams.map((scam) => (
              <div
                key={scam.id}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    {/* Categoria e Status */}
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                          scam.category
                        )}`}
                      >
                        {getCategoryLabel(scam.category)}
                      </span>
                      {scam.status === "VERIFIED" && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Verificado
                        </span>
                      )}
                    </div>

                    {/* Título */}
                    <Link
                      href={`/golpe/${scam.id}`}
                      className="text-xl font-semibold text-gray-900 hover:text-red-600 transition-colors block mb-2"
                    >
                      {scam.title}
                    </Link>

                    {/* Descrição */}
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {scam.description}
                    </p>

                    {/* Metadados */}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Salvo em {formatDate(scam.savedAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {scam.views} visualizações
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        {scam._count.comments} comentários
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {scam._count.likes} curtidas
                      </span>
                    </div>

                    {/* Autor */}
                    <div className="mt-3 text-sm text-gray-500">
                      Denunciado por <span className="font-medium">{scam.user.name}</span>
                    </div>
                  </div>

                  {/* Botão de remover */}
                  <button
                    onClick={() => handleRemove(scam.id)}
                    disabled={removingId === scam.id}
                    className="ml-4 p-2 text-gray-500 hover:text-red-600 transition-colors disabled:opacity-50"
                    title="Remover dos salvos"
                  >
                    {removingId === scam.id ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600" />
                    ) : (
                      <BookmarkX className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            ))}

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                <span className="px-4 py-2 text-gray-700">
                  Página {page} de {totalPages}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Próxima
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}