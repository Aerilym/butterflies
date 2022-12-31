interface Props {
  title: string;
  description: string;
}

export default function Analytics(props: Props) {
  return (
    <div className="header">
      <h2>{props.title}</h2>
      <p>{props.description}</p>
    </div>
  );
}
