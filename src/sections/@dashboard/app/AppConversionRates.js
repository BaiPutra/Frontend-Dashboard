import React, { useState } from 'react';
import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import ReactApexChart from 'react-apexcharts';
// @mui
import { Box, Card, CardHeader, Stack, Button, Modal, Typography } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { clsx } from 'clsx';
// utils
import { fNumber } from '../../../utils/formatNumber';
// components
import { BaseOptionChart } from '../../../components/chart';

const style = {
  height: 600,
  // padding: 1,
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '70%',
  bgcolor: 'background.paper',
  borderRadius: 2,
  border: '1px solid #000',
  boxShadow: 24,
  p: 4,
  '& .super-app-theme--cell': {
    backgroundColor: 'rgba(224, 183, 60, 0.55)',
    color: '#1a3e72',
    fontWeight: '600',
  },
  '& .super-app.negative': {
    backgroundColor: '#d47483',
    color: '#1a3e72',
    fontWeight: '600',
  },
  '& .super-app.positive': {
    backgroundColor: 'rgba(157, 255, 118, 0.49)',
    color: '#1a3e72',
    fontWeight: '600',
  },
};

AppConversionRates.propTypes = {
  header: PropTypes.string,
  title: PropTypes.string,
  subheader: PropTypes.string,
  chartData: PropTypes.array.isRequired,
  rows: PropTypes.array,
};

export default function AppConversionRates({ header, title, subheader, chartData, rows, color, ...other }) {
  const details = [
    { field: 'id', headerName: 'No', flex: 0.5 },
    { field: 'nama', headerName: header, flex: 2 },
    { field: 'total', headerName: 'Tiket Selesai', type: 'number', headerAlign: 'center', align: 'center', flex: 1 },
    { field: 'targetIn', headerName: 'Sesuai Target', type: 'number', headerAlign: 'center', align: 'center', flex: 1 },
    {
      field: 'targetOut',
      headerName: 'Keluar Target',
      type: 'number',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
    },
    {
      field: 'rateTarget',
      headerName: 'Persentase (%)',
      type: 'number',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      cellClassName: (params) => {
        if (params.value == null) {
          return '';
        }
        return clsx('super-app', {
          negative: params.value < 95,
          positive: params.value >= 95,
        });
      },
    },
  ];

  const chartLabels = chartData.map((i) => i.label);

  const chartSeries = chartData.map((i) => i.value);

  const chartOptions = merge(BaseOptionChart(), {
    tooltip: {
      marker: { show: false },
      y: {
        formatter: (seriesName) => fNumber(seriesName),
        title: {
          formatter: () => '',
        },
      },
    },
    plotOptions: {
      bar: { horizontal: true, barHeight: '20%', borderRadius: 2 },
    },
    xaxis: {
      categories: chartLabels,
    },
    colors: [color],
  });

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [pageSize, setPageSize] = React.useState(10);

  return (
    <Card {...other}>
      <Stack direction="row" justifyContent="space-between">
        <CardHeader title={title} subheader={subheader} />
        <Box sx={{ pr: 5, pt: 3, pb: 1 }}>
          <Button variant="text" onClick={handleOpen}>
            Lihat Semua
          </Button>
        </Box>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography variant="h6" sx={{ pb: 1 }}>
              {title}
            </Typography>
            <Box sx={{ height: 510 }}>
              <DataGrid
                rows={rows}
                columns={details}
                pageSize={pageSize}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                rowsPerPageOptions={[10, 15, 20]}
                pagination
                disableColumnSelector
                disableDensitySelector
                components={{ Toolbar: GridToolbar }}
                componentsProps={{
                  toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: { debounceMs: 1000 },
                    csvOptions: {
                      fileName: `${title}`,
                      delimiter: ';',
                      utf8WithBom: true,
                    },
                  },
                }}
              />
            </Box>
          </Box>
        </Modal>
      </Stack>

      <Box sx={{ mx: 3 }} dir="ltr">
        <ReactApexChart type="bar" series={[{ data: chartSeries }]} options={chartOptions} height={400} />
      </Box>
    </Card>
  );
}
