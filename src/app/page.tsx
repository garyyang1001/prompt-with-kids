import Link from 'next/link'
import { Sparkles, Heart, Palette, Play } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-pink-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-3xl">🧸</span>
            <span className="text-xl font-bold text-orange-600">創想小宇宙</span>
          </div>
          <Link href="/story/toddler-adventure" className="btn-primary bg-orange-500 hover:bg-orange-600">
            開始冒險 🚀
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            和寶貝一起創作
            <span className="text-orange-600 block mt-2">今天的小冒險！</span>
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            專為3-6歲幼兒設計的親子共創平台。透過簡單有趣的互動，
            激發孩子的想像力和語言表達能力。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/story/toddler-adventure" className="btn-primary text-lg px-8 py-4 bg-orange-500 hover:bg-orange-600 rounded-full shadow-lg">
              🎈 開始今天的冒險
            </Link>
            <Link href="#how-it-works" className="btn-secondary text-lg px-8 py-4 bg-white text-orange-600 border-2 border-orange-300 hover:bg-orange-50 rounded-full">
              📖 瞭解玩法
            </Link>
          </div>
        </div>

        {/* Cute illustrations */}
        <div className="mt-12 flex justify-center space-x-4 text-5xl">
          <span className="animate-bounce">🐰</span>
          <span className="animate-bounce delay-100">🌈</span>
          <span className="animate-bounce delay-200">⭐</span>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          為什麼孩子會愛上？
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold mb-2 text-purple-600">創意無限</h3>
            <p className="text-gray-600">
              孩子選擇角色、地點和活動，AI幫助將想法變成精彩故事
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="text-4xl mb-4">👨‍👩‍👧</div>
            <h3 className="text-xl font-semibold mb-2 text-green-600">親子時光</h3>
            <p className="text-gray-600">
              家長引導、孩子參與，共同創造獨一無二的故事回憶
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="text-4xl mb-4">🌟</div>
            <h3 className="text-xl font-semibold mb-2 text-yellow-600">簡單有趣</h3>
            <p className="text-gray-600">
              15-20分鐘完成一個故事，每次都有新驚喜
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            5步創作小冒險
          </h2>
          <div className="grid md:grid-cols-5 gap-6 max-w-6xl mx-auto">
            {[
              { emoji: '🦊', title: '選擇朋友', desc: '挑選故事主角' },
              { emoji: '🏖️', title: '去哪玩', desc: '選擇冒險地點' },
              { emoji: '🎪', title: '做什麼', desc: '決定有趣活動' },
              { emoji: '🌧️', title: '小困難', desc: '遇到小挑戰' },
              { emoji: '🎉', title: '開心解決', desc: '想出好辦法' }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-3">
                  {step.emoji}
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="bg-gradient-to-r from-orange-400 to-pink-400 rounded-3xl p-8 md:p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">準備好開始冒險了嗎？</h2>
          <p className="text-xl mb-8 opacity-90">
            每個故事都是獨一無二的珍貴回憶
          </p>
          <Link 
            href="/story/toddler-adventure" 
            className="inline-block bg-white text-orange-600 font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-shadow text-lg"
          >
            立即開始創作 →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-2xl">🧸</span>
            <span className="text-lg font-semibold">創想小宇宙</span>
          </div>
          <p className="text-gray-400">
            讓每個家庭都能在AI時代保持創造力和想像力
          </p>
        </div>
      </footer>
    </div>
  )
}
