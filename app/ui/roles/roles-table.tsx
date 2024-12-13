import { Role } from '@/app/lib/definitions';
import Table from '../components/table';
import TableActionsCell from '../components/table-actions-cell';
import { DeleteIconButton } from '../components/icon-button';
import { TrashIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { disableRole } from '@/app/lib/actions/role-actions';
import { ActionEnum, ModuleEnum } from '@/app/lib/enums/authActionModule';
import AuthWrapper from '@/components/authWrapper';

export default async function RolesTable({ data }: { data: any }) {
  return (
    <div className="flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg">
          <Table titles={['Rol']}>
            {data?.map((item: Role) => (
              <tr
                key={`user_${item.name}`}
                // className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg "
                className={clsx(
                  'w-full border-b py-3 text-sm last-of-type:border-none',
                  '[&:first-child>td:first-child]:rounded-tl-lg',
                  '[&:first-child>td:last-child]:rounded-tr-lg',
                  '[&:last-child>td:first-child]:rounded-bl-lg',
                  '[&:last-child>td:last-child]:rounded-br-lg',
                )}
              >
                <td className="whitespace-nowrap py-3 pl-6 pr-3">
                  <div className="flex items-center gap-3">
                    <p>
                      <span className={clsx({ 'line-through': item.disabled })}>
                        {item.name}
                      </span>
                      {item.disabled ? (
                        <span className="ml-2 rounded-lg border bg-red-300 px-2 py-1">
                          Deshabilitado
                        </span>
                      ) : null}
                    </p>
                  </div>
                </td>
                <TableActionsCell id={item.id} path="/welcome/roles">
                  <AuthWrapper
                    module={ModuleEnum.ROLE}
                    action={ActionEnum.DELETE}
                  >
                    {!item.disabled && (
                      <DeleteIconButton
                        id="deleteRole"
                        deleteAction={disableRole.bind(null, item.id)}
                      >
                        <TrashIcon className="w-5" />
                      </DeleteIconButton>
                    )}
                  </AuthWrapper>
                </TableActionsCell>
              </tr>
            ))}
          </Table>
        </div>
      </div>
    </div>
  );
}
