import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <main className="flex-1">
        <section
          className="text-center px-6 pt-20 pb-16"
          style={{ background: "var(--gradient-hero)" }}
        >
          <div className="max-w-2xl mx-auto">
            <span className="text-5xl mb-6 block">🌟</span>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4">
              每天记下{" "}
              <span className="gradient-text">一件好事</span>
            </h1>
            <p className="text-lg text-[var(--text-secondary)] mb-8 max-w-lg mx-auto">
              你今天为别人做了什么？一件小事，一个倾听，一个惊喜。大事小事都算数。
            </p>
            <Link href="/write" className="btn-primary text-lg inline-block">
              写下今天的好事 ✍️
            </Link>
          </div>

          {/* Decoratieve emoji rij */}
          <div className="mt-12 flex justify-center gap-4 text-2xl opacity-60 flex-wrap">
            <span>☕</span> <span>🌻</span> <span>🎈</span> <span>🍪</span>{" "}
            <span>🌈</span> <span>🦋</span> <span>🎵</span> <span>🌿</span>
          </div>
        </section>

        {/* Hoe het werkt */}
        <section className="px-6 py-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">
            怎么玩 🧩
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                emoji: "✍️",
                title: "写",
                desc: "今天你做了什么好事？一个举手之劳，一次倾听，一个惊喜——都行。",
              },
              {
                emoji: "📅",
                title: "看月份",
                desc: "每天一个小格子。一个月下来，你看到一整片颜色——那是你的善意痕迹。",
              },
              {
                emoji: "📈",
                title: "成长",
                desc: "你做了多少次好事？都是些什么事？看着自己的模式慢慢成型。",
              },
            ].map((item, i) => (
              <div key={i} className="card text-center">
                <span className="text-3xl mb-3 block">{item.emoji}</span>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="px-6 py-16 bg-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">
              免费开始 🎁
            </h2>
            <p className="text-[var(--text-secondary)] mb-10 max-w-md mx-auto">
              每月免费记录30件好事。想回看以前的历史？那需要订阅。
            </p>
            <div className="grid sm:grid-cols-2 gap-6 text-left">
              <div className="card border-2 border-[var(--accent-yellow)] relative">
                <span className="absolute -top-3 -right-3 bg-[var(--accent-yellow)] text-sm px-3 py-1 rounded-full font-bold">
                  🌟 免费
                </span>
                <p className="text-3xl font-bold mb-1">€0</p>
                <p className="text-sm text-[var(--text-secondary)] mb-4">
                  每月
                </p>
                <ul className="space-y-2 text-sm">
                  <li>✅ 每月 30 件好事</li>
                  <li>✅ 查看当月</li>
                  <li>✅ 基础统计</li>
                </ul>
              </div>
              <div className="card border-2 border-[var(--accent-orange)] relative">
                <span className="absolute -top-3 -right-3 bg-[var(--accent-orange)] text-white text-sm px-3 py-1 rounded-full font-bold">
                  ⭐ 热门
                </span>
                <p className="text-3xl font-bold mb-1">€3,99</p>
                <p className="text-sm text-[var(--text-secondary)] mb-4">
                  每月
                </p>
                <ul className="space-y-2 text-sm">
                  <li>✅ 无限记录</li>
                  <li>✅ 回看所有历史月份</li>
                  <li>✅ 年度报告 (PDF)</li>
                  <li>✅ 导出 CSV/JSON</li>
                  <li>✅ 主题配色</li>
                </ul>
              </div>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-6">
              可选月付 €3,99 或年付 €29。随时可取消。
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-sm text-[var(--text-secondary)] py-8 px-6">
          <p>✨ Dagdaad &mdash; 记录善意，让它成真。</p>
          <p className="mt-1">记下来，就会发生。</p>
        </footer>
      </main>
    </>
  );
}
