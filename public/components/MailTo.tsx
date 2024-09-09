import { _createElement, _fragment } from "simple-jsx-handler";

export const MailTo = (props: { name: string; domain: string }) => {
  return (
    <a
      href="#"
      on:click={(e: Event) => {
        e.preventDefault();
        e.stopPropagation();

        const email = `${props.name}@${props.domain}`;
        window.location.href = `mailto:${email}`;
      }}
    >{`${props.name} [at] ${props.domain.replaceAll(".", " [dot] ")}`}</a>
  );
};
