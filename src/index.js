//components
import { CounterComponent } from './components/CounterComponent';

document.addEventListener('DOMContentLoaded', () => {
  const root = document.createElement('div');
  root.id = 'root';
  document.body.appendChild(root);

  CounterComponent();
});
