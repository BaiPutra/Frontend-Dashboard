import React, { useState } from 'react';
import PropTypes from 'prop-types';
// @mui
import { alpha, styled } from '@mui/material/styles';
import { Typography, Card, Box, Modal, Button } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
// components
import Iconify from '../../../components/Iconify';

const columns = [
  { field: 'id', headerName: '#', flex: 0.6 },
  { field: 'tid', headerName: 'TID', flex: 0.5 },
  { field: 'jenisMasalah', headerName: 'Jenis Masalah', flex: 1.9 },
  { field: 'lokasi', headerName: 'Lokasi', flex: 1.7 },
  { field: 'kanca', headerName: 'Kantor Cabang', flex: 1.3 },
  { field: 'entryTiket', headerName: 'Tiket Masuk', flex: 0.8 },
  { field: 'updateTiket', headerName: 'Tiket Selesai', flex: 0.8 },
];

const style = {
  height: 600,
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '85%',
  bgcolor: 'background.paper',
  borderRadius: 2,
  border: '1px solid #000',
  boxShadow: 24,
  p: 4,
};

const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: 'center',
  marginBottom: theme.spacing(1),
}));

AppWidgetSummary.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.string,
  title: PropTypes.string.isRequired,
  total: PropTypes.number,
  percent: PropTypes.string,
  sx: PropTypes.object,
  rows: PropTypes.array,
};

export default function AppWidgetSummary({ title, total, icon, color = 'primary', percent, sx, rows, ...other }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <Card
      sx={{
        height: 188,
        py: 2,
        boxShadow: 0,
        textAlign: 'center',
        color: (theme) => theme.palette[color].darker,
        bgcolor: (theme) => theme.palette[color].lighter,
        ...sx,
      }}
      {...other}
    >
      <IconWrapperStyle
        sx={{
          color: (theme) => theme.palette[color].dark,
          backgroundImage: (theme) =>
            `linear-gradient(135deg, ${alpha(theme.palette[color].dark, 0)} 0%, ${alpha(
              theme.palette[color].dark,
              0.24
            )} 100%)`,
        }}
      >
        <Iconify icon={icon} width={28} height={28} />
      </IconWrapperStyle>

      <Typography variant="subtitle2" sx={{ opacity: 0.7 }}>
        {title}
      </Typography>

      <Button onClick={handleOpen} sx={{ color: (theme) => theme.palette[color].dark }}>
        <Typography variant="h3">
          {total} {percent}
        </Typography>
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography variant="h6" sx={{ pb: 1 }}>
            Daftar {title}
          </Typography>
          <Box sx={{ height: 510 }}>
            <DataGrid
              rows={rows}
              columns={columns}
              disableColumnSelector
              disableDensitySelector
              components={{ Toolbar: GridToolbar }}
              componentsProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 1000 },
                  csvOptions: {
                    fileName: `Daftar ${title}`,
                    delimiter: ';',
                    utf8WithBom: true,
                  },
                },
              }}
            />
          </Box>
        </Box>
      </Modal>
    </Card>
  );
}
