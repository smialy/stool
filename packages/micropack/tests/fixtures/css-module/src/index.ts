import global from './main.css';
import scoped from './main.module.css';

export const index = () => {
    const el1 = document.createElement('div');
	el1.innerHTML = global;

    const el2 = document.createElement('div');
	el2.className = scoped.foo;
}
