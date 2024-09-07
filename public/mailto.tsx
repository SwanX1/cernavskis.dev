import { _createElement, _fragment } from "simple-jsx-handler";

export const MailTo = (props: { name: string; domain: string }) => {
  const element = <a href="#">{`${props.name} [at] ${props.domain.replace('.', ' [dot] ')}`}</a>;

  element.addEventListener('click', (e: Event) => {
    e.preventDefault();
    e.stopPropagation();

    const email = `${props.name}@${props.domain}`;
    window.location.href = `mailto:${email}`;
  });

  return element;
};