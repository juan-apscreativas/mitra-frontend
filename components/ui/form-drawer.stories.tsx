import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import * as React from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import {
  FormDrawer,
  FormDrawerContent,
  FormDrawerHeader,
  FormDrawerTitle,
  FormDrawerDescription,
  FormDrawerBody,
  FormDrawerFooter,
  FormDrawerClose,
  FormDrawerSubmitFooter,
} from './form-drawer'
import { Button } from './button'
import { labels } from '@/lib/labels'

const meta: Meta = {
  title: 'UI/FormDrawer',
}
export default meta

/* -------------------------------------------------------------------------- */
/*  Default                                                                    */
/* -------------------------------------------------------------------------- */

function DefaultExample() {
  const [open, setOpen] = React.useState(false)
  const methods = useForm({ defaultValues: { name: '', email: '' } })

  return (
    <FormProvider {...methods}>
      <Button onClick={() => setOpen(true)}>{labels.common.create}</Button>
      <FormDrawer open={open} onOpenChange={setOpen}>
        <FormDrawerContent>
          <FormDrawerHeader>
            <FormDrawerTitle>{labels.users.create}</FormDrawerTitle>
            <FormDrawerDescription>
              Complete los datos del nuevo usuario.
            </FormDrawerDescription>
          </FormDrawerHeader>
          <FormDrawerBody>
            <form
              id="demo-form"
              className="space-y-4"
              onSubmit={methods.handleSubmit(() => {
                setOpen(false)
              })}
            >
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  {labels.users.fields.name}
                </label>
                <input
                  id="name"
                  className="flex h-8 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/50"
                  {...methods.register('name')}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  {labels.users.fields.email}
                </label>
                <input
                  id="email"
                  type="email"
                  className="flex h-8 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/50"
                  {...methods.register('email')}
                />
              </div>
            </form>
          </FormDrawerBody>
          <FormDrawerSubmitFooter formId="demo-form" />
        </FormDrawerContent>
      </FormDrawer>
    </FormProvider>
  )
}

export const Default: StoryObj = {
  render: () => <DefaultExample />,
}

/* -------------------------------------------------------------------------- */
/*  Small                                                                      */
/* -------------------------------------------------------------------------- */

function SmallExample() {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Small drawer</Button>
      <FormDrawer open={open} onOpenChange={setOpen} size="sm">
        <FormDrawerContent>
          <FormDrawerHeader>
            <FormDrawerTitle>Small Drawer</FormDrawerTitle>
          </FormDrawerHeader>
          <FormDrawerBody>
            <p className="text-sm text-muted-foreground">
              This is a small-size drawer (sm:max-w-sm).
            </p>
          </FormDrawerBody>
          <FormDrawerFooter>
            <FormDrawerClose render={<Button variant="outline" />}>
              {labels.common.cancel}
            </FormDrawerClose>
          </FormDrawerFooter>
        </FormDrawerContent>
      </FormDrawer>
    </>
  )
}

export const Small: StoryObj = {
  render: () => <SmallExample />,
}

/* -------------------------------------------------------------------------- */
/*  Large                                                                      */
/* -------------------------------------------------------------------------- */

function LargeExample() {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Large drawer</Button>
      <FormDrawer open={open} onOpenChange={setOpen} size="lg">
        <FormDrawerContent>
          <FormDrawerHeader>
            <FormDrawerTitle>Large Drawer</FormDrawerTitle>
            <FormDrawerDescription>
              This uses the lg size variant (sm:max-w-xl).
            </FormDrawerDescription>
          </FormDrawerHeader>
          <FormDrawerBody>
            <p className="text-sm text-muted-foreground">
              The content area scrolls independently when it overflows.
            </p>
          </FormDrawerBody>
          <FormDrawerFooter>
            <FormDrawerClose render={<Button variant="outline" />}>
              {labels.common.cancel}
            </FormDrawerClose>
          </FormDrawerFooter>
        </FormDrawerContent>
      </FormDrawer>
    </>
  )
}

export const Large: StoryObj = {
  render: () => <LargeExample />,
}

/* -------------------------------------------------------------------------- */
/*  ExtraLarge                                                                 */
/* -------------------------------------------------------------------------- */

function ExtraLargeExample() {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Extra-large drawer</Button>
      <FormDrawer open={open} onOpenChange={setOpen} size="xl">
        <FormDrawerContent>
          <FormDrawerHeader>
            <FormDrawerTitle>Extra-Large Drawer</FormDrawerTitle>
            <FormDrawerDescription>
              This uses the xl size variant (sm:max-w-2xl).
            </FormDrawerDescription>
          </FormDrawerHeader>
          <FormDrawerBody>
            <div className="space-y-4">
              {Array.from({ length: 20 }, (_, i) => (
                <p key={i} className="text-sm text-muted-foreground">
                  Scrollable content line {i + 1}. The body area supports
                  overflow scrolling so the header and footer remain sticky.
                </p>
              ))}
            </div>
          </FormDrawerBody>
          <FormDrawerFooter>
            <FormDrawerClose render={<Button variant="outline" />}>
              {labels.common.cancel}
            </FormDrawerClose>
            <Button>{labels.common.save}</Button>
          </FormDrawerFooter>
        </FormDrawerContent>
      </FormDrawer>
    </>
  )
}

export const ExtraLarge: StoryObj = {
  render: () => <ExtraLargeExample />,
}
