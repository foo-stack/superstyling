/* oxlint-disable react-perf/jsx-no-new-object-as-prop, react-perf/jsx-no-new-array-as-prop, react-perf/jsx-no-jsx-as-prop -- docs page */
import { Avatar, HStack, Text } from "@superstyling/core";
import { ComponentDemo } from "../../src/docs/ComponentDemo";
import { DocsPage, PropsTable, Section } from "../../src/docs/DocsLayout";

export default function AvatarPage() {
  return (
    <DocsPage
      title="Avatar"
      description="User-image primitive with a fallback slot. Mirrors Tamagui's Avatar compound structure — Avatar.Image + Avatar.Fallback — so the fallback renders whenever the image fails to load."
    >
      <Section title="Import">
        <ComponentDemo
          code={`import { Avatar } from "@superstyling/core";`}
          preview={<Text fontFamily="$mono">import {"{ Avatar }"} from "@superstyling/core";</Text>}
          defaultOpen
        />
      </Section>

      <Section title="Basic usage">
        <ComponentDemo
          code={`<Avatar circular size="$6">
  <Avatar.Image src="https://i.pravatar.cc/150?img=1" />
  <Avatar.Fallback backgroundColor="$primaryMuted" />
</Avatar>`}
          preview={
            <Avatar circular size="$6">
              <Avatar.Image src="https://i.pravatar.cc/150?img=1" />
              <Avatar.Fallback backgroundColor="$primaryMuted" />
            </Avatar>
          }
        />
      </Section>

      <Section title="Sizes">
        <ComponentDemo
          code={`<HStack gap="$3" alignItems="center">
  <Avatar circular size="$4"><Avatar.Image src="..." /></Avatar>
  <Avatar circular size="$6"><Avatar.Image src="..." /></Avatar>
  <Avatar circular size="$8"><Avatar.Image src="..." /></Avatar>
</HStack>`}
          preview={
            <HStack gap="$3" alignItems="center">
              <Avatar circular size="$4">
                <Avatar.Image src="https://i.pravatar.cc/80?img=2" />
                <Avatar.Fallback backgroundColor="$primaryMuted" />
              </Avatar>
              <Avatar circular size="$6">
                <Avatar.Image src="https://i.pravatar.cc/150?img=3" />
                <Avatar.Fallback backgroundColor="$primaryMuted" />
              </Avatar>
              <Avatar circular size="$8">
                <Avatar.Image src="https://i.pravatar.cc/200?img=4" />
                <Avatar.Fallback backgroundColor="$primaryMuted" />
              </Avatar>
            </HStack>
          }
        />
      </Section>

      <Section title="Fallback (image missing)">
        <ComponentDemo
          code={`<Avatar circular size="$6">
  <Avatar.Image src="/not-a-real-url.png" />
  <Avatar.Fallback backgroundColor="$primaryMuted" />
</Avatar>`}
          preview={
            <Avatar circular size="$6">
              <Avatar.Image src="/not-a-real-url.png" />
              <Avatar.Fallback backgroundColor="$primaryMuted" />
            </Avatar>
          }
        />
      </Section>

      <Section title="Props — Avatar (root)">
        <PropsTable
          props={[
            {
              name: "size",
              type: "$token | number",
              default: "$5",
              description: "Overall square size.",
            },
            {
              name: "circular",
              type: "boolean",
              default: "false",
              description: "Round corners fully. Leave off for a square avatar.",
            },
          ]}
        />
      </Section>
    </DocsPage>
  );
}
