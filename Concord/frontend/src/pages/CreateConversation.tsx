import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

// {
//     UserName string
//     FirstName string
//     LastName string 
//     ProfilePicURL string
// }

const columns: GridColDef[] = [
	{ field: 'UserName', headerName: 'Username', width: 130 },
	{ field: 'FirstName', headerName: 'First Name', width: 130 },
	{ field: 'LastName', headerName: 'Last Name', width: 130 },
	// {
	//     field: 'age',
	//     headerName: 'Age',
	//     type: 'number',
	//     width: 90,
	// },
	// {
	//     field: 'fullName',
	//     headerName: 'Full name',
	//     description: 'This column has a value getter and is not sortable.',
	//     sortable: false,
	//     width: 160,
	//     valueGetter: (params: GridValueGetterParams) =>
	//         `${params.row.firstName || ''} ${params.row.lastName || ''}`,
	// },
];


const rows = [
	{ id: 1, LastName: 'Granger', FirstName: 'Hermione', },
	{ id: 2, LastName: 'Weasley', FirstName: 'Ron' },
	{ id: 3, LastName: 'Potter', FirstName: 'Harry' },
	{ id: 4, LastName: 'Weasley', FirstName: 'Ginny' },
	{ id: 5, LastName: 'Black', FirstName: 'Sirius' },
];


export default function CreateConversation() {

	return (
		<>
			<div className="flex flex-col items-center justify-top h-screen">
				<h1 className="m-4">Create Conversation</h1>
				<div style={{ height: 400, width: '60%' }}>
					<DataGrid
						rows={rows}
						columns={columns}
						initialState={{
							pagination: {
								paginationModel: { page: 0, pageSize: 5 },
							},
						}}
						pageSizeOptions={[10, 25, 50]}
						checkboxSelection
					/>
				</div>
			</div>
		</>
	)
}


