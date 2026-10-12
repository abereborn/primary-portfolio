import type { techStack } from "../../data/techStack";

type Category = (typeof techStack)[number];

export default function TechCategory({ category, index }: { category: Category; index: number }) {
  return (
    <article className={`fact rv tech-index__entry tech-index__entry--${index + 1}`}>
      <header>
        <span className="f-no">{category.number}</span>
        <h4>{category.title}</h4>
      </header>
      <ul className="dots-list tech-index__items">
        {category.items.map((item, itemIndex) => (
          <li className={itemIndex < (index === 0 ? 3 : 1) ? "is-core" : undefined} key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
}
