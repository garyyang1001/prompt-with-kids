import Link from 'next/link'
import { Sparkles, Heart, Brain, Users } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-gray-900">AI親子創作坊</span>
          </div>
          <div className="hidden md:flex space-x-6">
            <Link href="#features" className="text-gray-600 hover:text-primary transition-colors">
              功能特色
            </Link>
            <Link href="#templates" className="text-gray-600 hover:text-primary transition-colors">
              學習模板
            </Link>
            <Link href="/learn" className="btn-primary">
              開始學習
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            和孩子一起創作
            <span className="text-primary block mt-2">掌握AI溝通技巧</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            在溫暖的親子時光中，自然學會Prompt Engineering思維。
            不是教技術，而是培養AI時代的基礎能力。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/learn" className="btn-primary text-lg px-8 py-4">
              🚀 開始免費體驗
            </Link>
            <Link href="#how-it-works" className="btn-secondary text-lg px-8 py-4">
              📖 了解學習流程
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          為什麼選擇我們？
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="card text-center">
            <Brain className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">思維培養</h3>
            <p className="text-gray-600">
              培養結構化思考和清晰表達的能力，為AI時代做準備
            </p>
          </div>
          <div className="card text-center">
            <Heart className="h-12 w-12 text-secondary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">親子共學</h3>
            <p className="text-gray-600">
              在創作過程中增進親子關係，共同成長
            </p>
          </div>
          <div className="card text-center">
            <Users className="h-12 w-12 text-purple-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">自然學習</h3>
            <p className="text-gray-600">
              在遊戲中掌握複雜技能，無壓力學習體驗
            </p>
          </div>
          <div className="card text-center">
            <Sparkles className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">創意激發</h3>
            <p className="text-gray-600">
              激發想像力和創造力，讓學習變得有趣
            </p>
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section id="templates" className="bg-bg-light py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            選擇你的學習主題
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="template-card template-basic">
              <div className="text-4xl mb-4">🥛</div>
              <h3 className="text-xl font-semibold mb-2">我的一天</h3>
              <span className="inline-block bg-primary-light text-white px-3 py-1 rounded-full text-sm mb-4">
                基礎級
              </span>
              <p className="text-gray-600 mb-4">
                學習具體化描述、環境感知、情感表達
              </p>
              <Link href="/learn?template=daily-life" className="btn-primary w-full">
                開始學習
              </Link>
            </div>
            
            <div className="template-card template-intermediate opacity-50">
              <div className="text-4xl mb-4">🦄</div>
              <h3 className="text-xl font-semibold mb-2">夢想冒險</h3>
              <span className="inline-block bg-secondary text-white px-3 py-1 rounded-full text-sm mb-4">
                進階級
              </span>
              <p className="text-gray-600 mb-4">
                掌握角色設定、情節發展、衝突解決
              </p>
              <button className="btn-secondary w-full" disabled>
                即將推出
              </button>
            </div>
            
            <div className="template-card template-creative opacity-50">
              <div className="text-4xl mb-4">🐻</div>
              <h3 className="text-xl font-semibold mb-2">動物朋友</h3>
              <span className="inline-block bg-purple-500 text-white px-3 py-1 rounded-full text-sm mb-4">
                創意級
              </span>
              <p className="text-gray-600 mb-4">
                培養互動關係、創意想像、複雜場景構建
              </p>
              <button className="btn-secondary w-full" disabled>
                即將推出
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          四級學習進程
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
              1
            </div>
            <h3 className="text-lg font-semibold mb-2">無意識參與</h3>
            <p className="text-gray-600">
              在不知不覺中開始接觸prompt概念
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
              2
            </div>
            <h3 className="text-lg font-semibold mb-2">引導式發現</h3>
            <p className="text-gray-600">
              開始主動思考如何改善描述
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
              3
            </div>
            <h3 className="text-lg font-semibold mb-2">主動應用</h3>
            <p className="text-gray-600">
              主動嘗試優化描述技巧
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
              4
            </div>
            <h3 className="text-lg font-semibold mb-2">創意突破</h3>
            <p className="text-gray-600">
              創造性地運用prompt技巧
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">AI親子創作坊</span>
          </div>
          <p className="text-gray-400">
            讓我們一起為孩子的AI未來做準備！
          </p>
        </div>
      </footer>
    </div>
  )
}