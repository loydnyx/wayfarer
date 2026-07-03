import { Heading, Body } from "./typography";

type Props = {
  title: string;
  description: string;
};

export function SectionTitle({
  title,
  description,
}: Props) {
  return (
    <div className="max-w-2xl">
      <Heading>{title}</Heading>

      <Body className="mt-3">
        {description}
      </Body>
    </div>
  );
}