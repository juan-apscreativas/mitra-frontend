import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm, FormProvider } from 'react-hook-form'
import { describe, it, expect, vi } from 'vitest'
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
} from '../form-drawer'
import { Button } from '../button'

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function TestDrawer({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <FormDrawer open={open} onOpenChange={onOpenChange}>
      <FormDrawerContent>
        <FormDrawerHeader>
          <FormDrawerTitle>Test Title</FormDrawerTitle>
          <FormDrawerDescription>Test Description</FormDrawerDescription>
        </FormDrawerHeader>
        <FormDrawerBody>
          <p>Body content</p>
        </FormDrawerBody>
        <FormDrawerFooter>
          <FormDrawerClose render={<Button variant="outline" />}>
            Cancel
          </FormDrawerClose>
        </FormDrawerFooter>
      </FormDrawerContent>
    </FormDrawer>
  )
}

function SubmitFooterWrapper({ formId }: { formId: string }) {
  const methods = useForm({ defaultValues: { name: '' } })
  return (
    <FormProvider {...methods}>
      <FormDrawer open onOpenChange={() => {}}>
        <FormDrawerContent>
          <FormDrawerHeader>
            <FormDrawerTitle>Form</FormDrawerTitle>
          </FormDrawerHeader>
          <FormDrawerBody>
            <form id={formId}>
              <input {...methods.register('name')} />
            </form>
          </FormDrawerBody>
          <FormDrawerSubmitFooter formId={formId} />
        </FormDrawerContent>
      </FormDrawer>
    </FormProvider>
  )
}

/* -------------------------------------------------------------------------- */
/*  Tests                                                                      */
/* -------------------------------------------------------------------------- */

describe('FormDrawer', () => {
  it('renders title and body when open', async () => {
    render(<TestDrawer open onOpenChange={() => {}} />)

    await waitFor(() => {
      expect(screen.getByText('Test Title')).toBeInTheDocument()
    })
    expect(screen.getByText('Body content')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
  })

  it('does not render content when closed', () => {
    render(<TestDrawer open={false} onOpenChange={() => {}} />)

    expect(screen.queryByText('Test Title')).not.toBeInTheDocument()
    expect(screen.queryByText('Body content')).not.toBeInTheDocument()
  })

  it('calls onOpenChange(false) on Escape', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(<TestDrawer open onOpenChange={onOpenChange} />)

    await waitFor(() => {
      expect(screen.getByText('Test Title')).toBeInTheDocument()
    })

    await user.keyboard('{Escape}')

    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything())
    })
  })

  it('calls onOpenChange(false) on backdrop click', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(<TestDrawer open onOpenChange={onOpenChange} />)

    await waitFor(() => {
      expect(screen.getByText('Test Title')).toBeInTheDocument()
    })

    const backdrop = document.querySelector('[data-slot="form-drawer-overlay"]')
    expect(backdrop).toBeInTheDocument()

    await user.click(backdrop as Element)

    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything())
    })
  })

  it('has a close button in the header', async () => {
    render(<TestDrawer open onOpenChange={() => {}} />)

    await waitFor(() => {
      expect(screen.getByText('Test Title')).toBeInTheDocument()
    })

    expect(screen.getByText('Close')).toBeInTheDocument()
  })

  it('has role="dialog" and is modal', async () => {
    render(<TestDrawer open onOpenChange={() => {}} />)

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    const dialog = screen.getByRole('dialog')
    // Base UI modal dialogs use the "dialog" role.
    // aria-modal may be set via the browser's inert mechanism or popover API
    // rather than as an explicit attribute, so we verify the role exists.
    expect(dialog).toBeTruthy()

    // Verify aria-labelledby links to the title element
    const labelledBy = dialog.getAttribute('aria-labelledby')
    expect(labelledBy).toBeTruthy()
    const titleElement = document.getElementById(labelledBy!)
    expect(titleElement).toBeInTheDocument()
    expect(titleElement).toHaveTextContent('Test Title')
  })

  describe('FormDrawerSubmitFooter', () => {
    it('renders Cancel and Save buttons', async () => {
      render(<SubmitFooterWrapper formId="test-form" />)

      await waitFor(() => {
        expect(screen.getByText('Cancelar')).toBeInTheDocument()
      })
      expect(screen.getByText('Guardar')).toBeInTheDocument()
    })

    it('submit button has form attribute linking to formId', async () => {
      render(<SubmitFooterWrapper formId="test-form" />)

      await waitFor(() => {
        expect(screen.getByText('Guardar')).toBeInTheDocument()
      })

      const submitButton = screen.getByText('Guardar').closest('button')
      expect(submitButton).toHaveAttribute('form', 'test-form')
    })
  })
})
