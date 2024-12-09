import Image from 'next/image';
import { Promotion } from '@/app/lib/definitions';
import Table from '../components/table';
import TableActionsCell from '../components/table-actions-cell';
import { ActionButtonWithLoading } from '../components/icon-button';
import DynamicHeroIcon from '../dynamic-hero-icon';
import clsx from 'clsx';
import { exportParticipantsToExcel } from '@/app/lib/actions/promotion-participants';
import { FileUpIcon } from 'lucide-react';

export default async function DatabasePromotionsTable({ data }: { data: any }) {
  let counter = 0;
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <Table titles={['Promociónes']}>
            {data?.map((item: Promotion) => (
              <tr
                key={`pro_${item.name.toString()}_${counter++}`}
                // className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg "
                className={clsx(
                  'w-full border-b py-3 text-sm last-of-type:border-none',
                  '[&:first-child>td:first-child]:rounded-tl-lg',
                  '[&:first-child>td:last-child]:rounded-tr-lg',
                  '[&:last-child>td:first-child]:rounded-bl-lg',
                  '[&:last-child>td:last-child]:rounded-br-lg',
                  { 'bg-red-600': item.is_deleted },
                )}
              >
                <td className="whitespace-nowrap py-3 pl-6 pr-3">
                  <div className="flex items-center gap-3">
                    {item.background?.path ? (
                      <Image
                        src={
                          item.background?.path?.startsWith('http')
                            ? item.background.path
                            : `/${item.background.path?.replace(/^\/+/, '')}` // ensures only one leading slash
                        }
                        className="rounded-md"
                        width={28}
                        height={28}
                        alt={`Logo del local ${item.name}`}
                      />
                    ) : (
                      <DynamicHeroIcon icon="PhotoIcon" className="h-7 w-7" />
                    )}
                    <p>{item.name}</p>
                  </div>
                </td>
                <TableActionsCell
                  id={item.id}
                  removeEditButton={true}
                  path="/welcome/promotions"
                >
                  {!item.is_deleted && (
                    <ActionButtonWithLoading
                      id="deletePromotion"
                      action={exportParticipantsToExcel.bind(null, item.id)}
                      showDialogs={true}
                      successMessage="Se envió correctamente el archivo a la dirección de correo"
                      errorMessage="Error al enviar archivo"
                    >
                      <FileUpIcon className="w-6"></FileUpIcon>
                    </ActionButtonWithLoading>
                  )}
                </TableActionsCell>
              </tr>
            ))}
          </Table>
        </div>
      </div>
    </div>
  );
}
