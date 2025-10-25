import { createFileRoute } from '@tanstack/react-router'
import { LucyModule } from '../components/LucyModule'

export const Route = createFileRoute('/lucy')({
  component: LucyModule,
})