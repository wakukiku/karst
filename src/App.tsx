import { useState } from "react";
import {
  useShop,
  useCatalog,
  Loading,
  CartButton,
  ShopOverlays,
  Footer,
  Filters,
  EmptyResults,
  Image,
  money,
} from "./core";
import { packStatus } from "./domain.mjs";
const roles: Record<string, string> = {
  pack: "Рюкзак",
  shelter: "Укрытие",
  sleep: "Спальный мешок",
  water: "Ёмкость для воды",
};
export default function App() {
  const shop = useShop("karst");
  const filter = useCatalog(shop.catalog?.products || []);
  const [trip, setTrip] = useState("overnight"),
    [extra, setExtra] = useState(1500);
  if (!shop.catalog) return <Loading shop={shop} />;
  const status = packStatus(shop.catalog.products, shop.cart, trip, extra);
  const percent = Math.min((status.total / status.limit) * 100, 100);
  return (
    <div id="top">
      <a href="#catalog" className="skip">
        К снаряжению
      </a>
      <div className="expedition-cover">
        <img
          src="assets/hero.jpg"
          alt="Палатка в высокогорье на фоне снежных вершин"
        />
        <header>
          <a className="wordmark" href="#top">
            <span>⩓</span> КАРСТ
          </a>
          <nav>
            <a href="#catalog">Снаряжение</a>
            <a href="#pack">Собрать рюкзак</a>
          </nav>
          <CartButton shop={shop} />
        </header>
        <section className="hero">
          <span className="eyebrow">СНАРЯЖЕНИЕ ДЛЯ СВОИХ МАРШРУТОВ</span>
          <h1>
            ЗА ПРЕДЕЛАМИ
            <br />
            <span>ПРИВЫЧНОГО.</span>
          </h1>
          <p>
            Берите нужное.
            <br />
            Оставляйте место для открытий.
          </p>
          <a className="primary" href="#catalog">
            СНАРЯДИТЬСЯ <span>↗</span>
          </a>
        </section>
        <div className="expedition-meta">
          <span>КОЛЛЕКЦИЯ / ВЫШЕ ЛЕСА</span>
          <span>01 — 04 / БАЗОВОЕ СНАРЯЖЕНИЕ</span>
        </div>
      </div>
      <main id="catalog">
        <div className="gear-heading">
          <h2>ВЕС ИМЕЕТ ЗНАЧЕНИЕ.</h2>
          <p>Соберите комплект. Проверьте каждый грамм.</p>
        </div>
        <div className="gear-layout">
          <section className="gear-list">
            <Filters state={filter} />
            <div className="products">
              {filter.filtered.map((p, i) => (
                <article key={p.id}>
                  <button
                    className="product-photo"
                    onClick={() => shop.setDetail(p)}
                    aria-label={`Подробнее: ${p.name}`}
                  >
                    <Image p={p} />
                    <span>0{i + 1}</span>
                  </button>
                  <div className="product-info">
                    <span className="gear-category">
                      {p.category} / {p.weight} Г
                    </span>
                    <button
                      className="product-name"
                      onClick={() => shop.setDetail(p)}
                    >
                      {p.name}
                    </button>
                    <p>{p.subtitle}</p>
                    <div className="buy-row">
                      <b>{money(p.price)}</b>
                      <button
                        aria-label={`Добавить ${p.name}`}
                        onClick={() => shop.add(p)}
                      >
                        В комплект <span>＋</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
              {!filter.filtered.length && <EmptyResults />}
            </div>
          </section>
          <aside className="pack-builder" id="pack">
            <div className="pack-header">
              <span>ВАШ КОМПЛЕКТ</span>
              <b>{shop.count.toString().padStart(2, "0")}</b>
            </div>
            <label className="route-label">
              Маршрут
              <select value={trip} onChange={(e) => setTrip(e.target.value)}>
                <option value="overnight">С ночёвкой</option>
                <option value="day">На один день</option>
              </select>
            </label>
            <div className="weight-dial">
              <svg viewBox="0 0 180 112" aria-hidden="true">
                <path
                  d="M20 94 A70 70 0 0 1 160 94"
                  fill="none"
                  stroke="#345469"
                  strokeWidth="10"
                />
                <path
                  d="M20 94 A70 70 0 0 1 160 94"
                  fill="none"
                  stroke={status.over ? "#ff9a72" : "#8fe2ff"}
                  strokeWidth="10"
                  pathLength="100"
                  strokeDasharray={`${percent} 100`}
                />
              </svg>
              <div>
                <strong>{(status.total / 1000).toFixed(2)}</strong>
                <span>кг / ориентир {status.limit / 1000} кг</span>
              </div>
            </div>
            <label className="extra-label" htmlFor="pack-extra">
              Вода и еда <output>{(extra / 1000).toFixed(1)} кг</output>
              <input
                id="pack-extra"
                type="range"
                min="0"
                max="4000"
                step="100"
                value={extra}
                onChange={(e) => setExtra(Number(e.target.value))}
              />
            </label>
            <div className="pack-checklist">
              {status.required.map((role) => (
                <div key={role}>
                  <span
                    className={
                      status.missing.includes(role) ? "unchecked" : "checked"
                    }
                  >
                    {status.missing.includes(role) ? "—" : "✓"}
                  </span>
                  {roles[role]}
                </div>
              ))}
            </div>
            <p
              className={"pack-status " + (status.over ? "over" : "")}
              aria-live="polite"
            >
              {status.over
                ? "Выше ориентира. Пересмотрите комплект."
                : status.missing.length
                  ? `Осталось добавить: ${status.missing.length}`
                  : "Базовый комплект собран."}
            </p>
            <button
              className="primary"
              disabled={!status.missing.length}
              onClick={() =>
                shop.addSet(
                  shop.catalog!.products.filter((p) =>
                    status.missing.includes(p.role!),
                  ),
                )
              }
            >
              Добавить недостающее <span>＋</span>
            </button>
            <button
              className="pack-cart"
              onClick={() => shop.setCartOpen(true)}
            >
              Открыть комплект · {money(status.cost)}
            </button>
            <small>
              Вес базового комплекта с водой и едой. Одежду и личные вещи
              учитывайте отдельно.
            </small>
          </aside>
        </div>
      </main>
      <div className="trail-line">
        <span>МЕНЬШЕ ВЕСА.</span>
        <b>БОЛЬШЕ МАРШРУТА.</b>
        <span>⩓</span>
      </div>
      <Footer shop={shop} />
      <ShopOverlays shop={shop} />
    </div>
  );
}
