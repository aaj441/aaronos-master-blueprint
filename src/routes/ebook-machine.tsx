import { createFileRoute } from '@tanstack/react-router'
import { EBookMachineModule } from '../components/EBookMachineModule'

export const Route = createFileRoute('/ebook-machine')({
  component: EBookMachineModule,
})