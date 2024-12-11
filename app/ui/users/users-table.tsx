import {SystemUser } from '@/app/lib/definitions';
import Table from '../components/table';
import TableActionsCell from '../components/table-actions-cell';
import { ActionButtonWithLoading } from '../components/action-button-with-loading';
import { TrashIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { disableUser } from '@/app/lib/actions/user-actions';

export default async function UsersTable({ data }: { data: any }) {
  return (
    <div className="flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg">
          <Table titles={['Usuario']}>
            {data?.map((item: SystemUser) => (
              <tr
                key={`user_${item.username.toString()}`}
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
                    {/* {item.logo?.path ? (
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
                    )} */}
                    <p>
                      <span className={clsx({ 'line-through': item.disabled })}>{item.username}</span> 
                      {item.disabled ? <span className='bg-red-300 border rounded-lg py-1 px-2 ml-2'>Deshabilitado</span> : null }
                    </p>
                  </div>
                </td>
                <TableActionsCell id={item.id} path="/welcome/users">
                  {!item.disabled && (
                    <ActionButtonWithLoading
                      id="deleteUser"
                      action={disableUser.bind(null, item.id)}
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
