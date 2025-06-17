import "../styles/manual.css";

export default function ManualItem({ feature }) {
  // return <h1>{feature.title}</h1>;
  return (
    <div className="manual-item">
      <img src={feature.img} alt={feature.title} className="manual-item-img" />
      <div className="manual-item-content">
        <h2 className="manual-item-title">{feature.title}</h2>
        <p className="manual-item-desc">{feature.description}</p>
      </div>
    </div>
  );
}
