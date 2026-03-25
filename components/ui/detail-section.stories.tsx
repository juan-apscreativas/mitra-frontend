import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Badge } from './badge'
import { DetailSection, DetailField } from './detail-section'

const meta = {
  title: 'UI/DetailSection',
  parameters: { layout: 'centered' },
} satisfies Meta

export default meta

export const Default: StoryObj = {
  render: () => (
    <div className="w-[400px] space-y-6">
      <DetailSection title="Información">
        <DetailField label="Nombre" value="John Doe" />
        <DetailField label="Email" value="john@example.com" />
        <DetailField label="Teléfono" value="+52 555 123 4567" />
      </DetailSection>
      <DetailSection title="Roles">
        <div className="flex flex-wrap gap-1.5 py-2">
          <Badge variant="secondary">Admin</Badge>
          <Badge variant="secondary">Editor</Badge>
        </div>
      </DetailSection>
    </div>
  ),
}
