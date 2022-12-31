import '../styles/loading.css';

const Loading: React.FC = () => {
  return (
    <div className="loading-screen">
      <div className="loading-screen-content">
        <div className="spinner" />
      </div>
    </div>
  );
};

export default Loading;
