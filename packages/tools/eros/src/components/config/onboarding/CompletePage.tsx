import React from 'react';
import { CompletePageData } from '../../../../../../types/api';
import Loading from '../../Loading';

type FormProps = {
  onSubmit: (value: CompletePageData) => void;
  visible: boolean;
};

export default function CompletePage({ onSubmit, visible }: FormProps) {
  const [completePage, setCompletePage] = React.useState({} as CompletePageData);
  const [loading, setLoading] = React.useState(true);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(completePage);
  }

  React.useEffect(() => {
    fetch('https://field-manager.butterfliesapp.workers.dev/options?key=completePage').then(
      async (response) => {
        const { value } = await response.json();
        setCompletePage(value);
        setLoading(false);
      }
    );
  }, []);

  return (
    <div className="onboarding-order">
      <h3>Complete Page</h3>
      {loading ? <Loading /> : null}
      <form
        onSubmit={handleSubmit}
        className="complete-page-form"
        style={{ visibility: visible ? 'visible' : 'hidden' }}
      >
        <label htmlFor="complete-page-heading">
          Heading:
          <input
            type="text"
            id="complete-page-heading"
            required
            value={completePage?.heading ?? ''}
            onChange={(e) => setCompletePage({ ...completePage, heading: e.target.value })}
          />
        </label>
        <label htmlFor="complete-page-subheading">
          Sub Heading:
          <input
            type="text"
            id="complete-page-subheading"
            required
            value={completePage?.subheading ?? ''}
            onChange={(e) => setCompletePage({ ...completePage, subheading: e.target.value })}
          />
        </label>
        <label htmlFor="complete-page-description">
          Description:
          <input
            type="text"
            id="complete-page-description"
            required
            value={completePage?.description ?? ''}
            onChange={(e) => setCompletePage({ ...completePage, description: e.target.value })}
          />
        </label>
        <label htmlFor="complete-page-button-label">
          Complete Button Label:
          <input
            type="text"
            id="complete-page-button-label"
            required
            value={completePage?.buttonLabel ?? ''}
            onChange={(e) => setCompletePage({ ...completePage, buttonLabel: e.target.value })}
          />
        </label>

        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}
