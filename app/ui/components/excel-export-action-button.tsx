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
import { useDate } from './client-side-excel-filters';
import { exportParticipantsByPromotionToExcel } from '@/app/lib/actions/promotion-participants';
import { DateTime } from 'luxon';
import { exportParticipantsToExcel } from '@/app/lib/actions/premise-actions';
import { cn } from '@/lib/utils';

interface Props {
  id: string;
  text?: string;
  tooltip?: string;
  children: React.ReactNode;
  showDialogs?: boolean;
  errorMessage?: string;
  promotionId?: string;
  premiseId?: string;
  className?: string;
  outlined?: boolean;
}

export function ExcelExportActionButton({
  id,
  text,
  tooltip,
  children,
  showDialogs,
  errorMessage = 'Error al ejecutar la acción',
  promotionId,
  premiseId,
  className,
  outlined,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [dialogMessage, setDialogMessage] = useState<string | null>(null);
  const [isErrorDialog, setIsErrorDialog] = useState(false);
  const { startDate, endDate} = useDate();

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      var response;
      if (promotionId) {
        response = await exportParticipantsByPromotionToExcel(
          promotionId,
          startDate,
          endDate,
        );
      }else{
        response = await exportParticipantsToExcel(
          startDate,
          endDate,
        )
      }
      if (!response) {
        throw 'Error al exportar Excel';
      }
      const blob = new Blob([response], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet ',
      });
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `listado_participantes_${DateTime.now().setZone('America/Montevideo').toFormat('yyyy-MM-dd_HH-mm-ss')}`;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      if (showDialogs) {
        setIsErrorDialog(true);

        const backendErrorMessage =
          error instanceof Error ? error.message : errorMessage;
        setDialogMessage(backendErrorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="inline-block">
      <FullScreenLoading isLoading={isLoading} />
      <Button
        className={cn("group relative rounded-md border p-2 ", className)}
        variant={ outlined ?  'outline' : 'default'}
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
      </Button>
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
