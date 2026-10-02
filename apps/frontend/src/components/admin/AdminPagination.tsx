import { useContext } from 'react'
import { Pagination, usePagination } from '../../components/ui/new/pagination'
import AdminPaginationContext from '../../contexts/admin/AdminPaginationContext'

export const AdminPagination = () => {
  const { currPage, setCurrPage, totalPages } = useContext(AdminPaginationContext)

  const items = usePagination({
    page: currPage,
    count: totalPages,
    siblingCount: 1,
    boundaryCount: 1,
  })

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrPage(page)
    }
  }

  return (
    <Pagination>
      <Pagination.List>
        <Pagination.Item>
          <Pagination.Previous onClick={() => goToPage(currPage - 1)} disabled={currPage === 1} />
        </Pagination.Item>

        {items.map((item) =>
          item.type === 'page' ? (
            <Pagination.Item key={item.key}>
              <Pagination.Link isActive={item.selected} onClick={() => goToPage(item.value)}>
                {item.value}
              </Pagination.Link>
            </Pagination.Item>
          ) : (
            <Pagination.Item key={item.key}>
              <Pagination.Ellipsis />
            </Pagination.Item>
          ),
        )}

        <Pagination.Item>
          <Pagination.Next onClick={() => goToPage(currPage + 1)} disabled={currPage === totalPages} />
        </Pagination.Item>
      </Pagination.List>
    </Pagination>
  )
}
