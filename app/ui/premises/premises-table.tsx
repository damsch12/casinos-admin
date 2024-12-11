import Image from 'next/image';
import { Premise } from '@/app/lib/definitions';
import Table from '../components/table';
import TableActionsCell from '../components/table-actions-cell';
import { ActionButtonWithLoading } from '../components/action-button-with-loading';
import { TrashIcon } from '@heroicons/react/24/outline';
import { disablePremise } from '@/app/lib/actions/premise-actions';
import DynamicHeroIcon from '../dynamic-hero-icon';
import clsx from 'clsx';

export default async function PremisesTable({ data }: { data: any }) {
  return (
    <div className="flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg">
          <Table titles={['Local']}>
            {data?.map((item: Premise) => (
              <tr
                key={`pre_${item.id.toString()}`}
                // className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg "
                className={clsx(
                  'w-full border-b py-3 text-sm last-of-type:border-none',
                  '[&:first-child>td:first-child]:rounded-tl-lg',
                  '[&:first-child>td:last-child]:rounded-tr-lg',
                  '[&:last-child>td:first-child]:rounded-bl-lg',
                  '[&:last-child>td:last-child]:rounded-br-lg'
                )}
              >
                <td className="whitespace-nowrap py-3 pl-6 pr-3">
                  <div className="flex items-center gap-3">
                    {item.logo?.path ? (
                      <Image
                        src={
                          item.logo?.path?.startsWith('http')
                            ? item.logo.path
                            : `/${item.logo.path?.replace(/^\/+/, '')}` // ensures only one leading slash
                        }
                        className="rounded-md"
                        width={58}
                        height={58}
                        alt={`Logo del local ${item.name}`}
                      />
                    ) : (
                      <DynamicHeroIcon icon="PhotoIcon" className="h-7 w-7" />
                    )}
                    <p>
                      <span className={clsx({ 'line-through': item.disabled })}>{item.name}</span> 
                      {item.disabled ? <span className='bg-red-300 border rounded-lg py-1 px-2 ml-2'>Deshabilitado</span> : null }
                    </p>
                  </div>
                </td>
                <TableActionsCell id={item.id} path="/welcome/premises">
                  {!item.disabled && (
                    <ActionButtonWithLoading
                      id="deletePremise"
                      action={disablePremise.bind(null, item.id)}
                    >
                      <TrashIcon className="w-5" />
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
