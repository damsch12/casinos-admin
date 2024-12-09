'use client';
import { useState } from 'react';
import FullScreenLoading from './fullScreenLoading';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Props {
  id: string;
  text?: string;
  tooltip?: string;
  action: any;
  children: React.ReactNode;
  showDialogs?: boolean;
  successMessage?: string;
  errorMessage?: string;
}

export function ActionButtonWithLoading({
  id,
  text,
  tooltip,
  action,
  children,
  showDialogs,
  successMessage = 'Acción ejecutada con éxito',
  errorMessage = 'Error al ejecutar la acción',
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [dialogMessage, setDialogMessage] = useState<string | null>(null);
  const [isErrorDialog, setIsErrorDialog] = useState(false);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await action();
      if (showDialogs) {
        setIsErrorDialog(false);
        setDialogMessage(successMessage);
      }
    } catch (error) {
      if (showDialogs) {
        setIsErrorDialog(true);
        setDialogMessage(errorMessage);
      }
      console.error('Error during action:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="inline-block">
      <FullScreenLoading isLoading={isLoading} />
      <button
        className="group relative rounded-md border p-2 hover:bg-gray-100"
        name={`iconbtn_${id}`}
        id={`iconbtn_${id}`}
        onClick={handleClick}
      >
        <span className="sr-only">{text}</span>
        {children}
        {tooltip && (
          <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 transform rounded-md bg-gray-700 px-2 py-1 text-sm text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {tooltip}
          </div>
        )}
      </button>
      <Dialog
        open={!!dialogMessage}
        onOpenChange={() => setDialogMessage(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle> {isErrorDialog ? 'Error' : 'Atención'}</DialogTitle>
          </DialogHeader>
          <DialogDescription>{dialogMessage}</DialogDescription>
          <DialogFooter>
            <Button
              className={
                isErrorDialog
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-blue-500 hover:bg-blue-600'
              }
              onClick={() => setDialogMessage(null)}
            >
              Aceptar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  );
}
