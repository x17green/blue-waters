import { mdiAccount, mdiCalendar, mdiCog, mdiHome } from '@mdi/js'
import Icon from '@mdi/react'
import type { Meta, StoryObj } from '@storybook/react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/src/components/ui/sidebar'

const meta = {
  title: 'UI/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Collapsible sidebar navigation with glassmorphism styling.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <SidebarProvider>
        <Story />
      </SidebarProvider>
    ),
  ],
} satisfies Meta<typeof Sidebar>

export default meta
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Sidebar>
      <SidebarHeader>
        <div className="px-6 py-4">
          <h2 className="text-lg font-semibold">Bayelsa Boat Club</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Icon path={mdiHome} size={0.8} />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Icon path={mdiCalendar} size={0.8} />
                  <span>Bookings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Icon path={mdiAccount} size={0.8} />
                  <span>Profile</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Icon path={mdiCog} size={0.8} />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-6 py-4">
          <p className="text-xs text-fg-muted">© 2026 Bayelsa Boat Club</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  ),
}
