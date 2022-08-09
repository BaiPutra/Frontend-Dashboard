import React, { useEffect, useState } from 'react';
import moment from 'moment-timezone';
import axios from 'axios';
import { useParams } from 'react-router-dom';
// @mui
import { Grid, Container, Typography, Card, Box, Stack, TextField, Button } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DataGrid } from '@mui/x-data-grid';

import { clsx } from 'clsx';
import { CSVLink } from 'react-csv';
import TiketDataService from '../helper/services';
// components
import Page from '../components/Page';
// sections
import {
  AppWidgetSummary,
  AppWebsiteVisits,
  AppConversionRates,
  Percentage,
  PerformaTable,
} from '../sections/@dashboard/app';

const columns = [
  { field: 'id', headerName: 'No', flex: 0.4 },
  { field: 'tanggal', headerName: 'Tanggal', flex: 1.5 },
  {
    field: 'tiketClose',
    headerName: 'Tiket Selesai',
    type: 'number',
    headerAlign: 'center',
    align: 'center',
    flex: 1,
    color: '#1a3e72',
  },
  {
    field: 'targetIn',
    headerName: 'Sesuai Target',
    type: 'number',
    headerAlign: 'center',
    align: 'center',
    flex: 1,
    cellClassName: (params) => {
      if (params.value == null) {
        return '';
      }
      return clsx('super-app', {
        in: params,
      });
    },
  },
  {
    field: 'targetOut',
    headerName: 'Keluar Target',
    type: 'number',
    headerAlign: 'center',
    align: 'center',
    flex: 1,
    cellClassName: (params) => {
      if (params.value == null) {
        return '';
      }
      return clsx('super-app', {
        out: params,
      });
    },
  },
  {
    field: 'rateTarget',
    headerName: 'Persentase (%)',
    type: 'number',
    headerAlign: 'center',
    align: 'center',
    flex: 1,
    cellClassName: (params) => {
      if (params.value == null) {
        return '';
      }
      return clsx('super-app', {
        negative: params.value < 80,
        positive: params.value > 80,
      });
    },
  },
];

export default function ATM() {
  const { bagian } = useParams();
  const initialKanca = {
    bagian: 'ATM',
  };

  const [tiket, setTiket] = useState([]);
  const [listTanggal, setListTanggal] = useState([]);
  const [listMinggu, setListMinggu] = useState([]);
  const [listKanca, setListKanca] = useState(initialKanca);
  const [jenisTiket, setJenisTiket] = useState([]);
  const [Implementor, setImplementor] = useState([]);

  useEffect(() => {
    performaKanca(bagian);
    getAll();
    perTanggal();
    perJenisMasalah();
    perMinggu();
    performaPemasang();
  }, [bagian]);

  const getAll = () => {
    TiketDataService.getAll()
      .then((response) => {
        setTiket(response.data);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const perTanggal = () => {
    TiketDataService.perTanggal()
      .then((response) => {
        setListTanggal(response.data);
        // console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const performaKanca = bagian => {
    TiketDataService.performaKanca(bagian)
      .then((response) => {
        setListKanca(response.data);
        // console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const perJenisMasalah = () => {
    TiketDataService.perJenisMasalah()
      .then((response) => {
        setJenisTiket(response.data);
        // console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const perMinggu = () => {
    TiketDataService.perMinggu()
      .then((response) => {
        setListMinggu(response.data);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const performaPemasang = () => {
    TiketDataService.performaPemasang()
      .then((response) => {
        setImplementor(response.data);
        // console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const minggu = listMinggu.map(({ sampai }) => sampai);
  const total = listMinggu.map(({ total }) => total);
  const totalIn = listMinggu.map(({ targetIn }) => targetIn);

  const targetIn = tiket.filter((tiket) => tiket.targetIn === 1);
  console.log(targetIn);

  const targetOut = tiket.filter((tiket) => tiket.targetIn === 0);
  console.log(targetOut);

  const rate = (targetIn.length / tiket.length) * 100;
  console.log(rate);

  const [value, setValue] = React.useState(new Date());
  const [value1, setValue1] = React.useState(new Date());

  const handleChange = (newValue) => {
    setValue(newValue);
  };
  const handleChange1 = (newValue) => {
    setValue1(newValue);
  };

  const newJenisTiket = jenisTiket.slice(0, 5);

  return (
    <Page title="ATM">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          ATM Section
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={2}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                label="Start Date"
                value={value}
                onChange={handleChange}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={2}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                label="End Date"
                value={value1}
                onChange={handleChange1}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={2} justifyContent="center">
            <Button
              variant="outlined"
              sx={{ height: '100%', minWidth: 228, maxWidth: 250 }}
              onClick={() => {
                axios
                  .get(
                    `http://localhost:3001/api/tiket/'ATM'/${moment(value).format('YYYY-MM-DD')}/${moment(value1).format(
                      'YYYY-MM-DD'
                    )}`
                  )
                  .then((response) => {
                    setTiket(response.data);
                    console.log(response.data);
                  })
                  .catch((e) => {
                    console.log(e);
                  });
              }}
            >
              Submit
            </Button>
          </Grid>
          
          <Grid item xs={6}>
            <Grid container justifyContent="flex-end" alignItems="stretch">
              <Button variant="contained" sx={{ width: 200, height: 55 }}>
                Export PDF
              </Button>
            </Grid>
          </Grid>

          <Grid item xs={6} sm={6} md={3}>
            <AppWidgetSummary
              title="Tiket Selesai"
              total={tiket.length}
              icon={'ant-design:file-done-outlined'}
              rows={tiket}
            />
          </Grid>

          <Grid item xs={6} sm={6} md={3}>
            <AppWidgetSummary
              title="Sesuai Target"
              total={targetIn.length}
              color="success"
              icon={'icon-park-solid:doc-success'}
              rows={targetIn}
            />
          </Grid>

          <Grid item xs={6} sm={6} md={3}>
            <AppWidgetSummary
              title="Keluar Target"
              total={targetOut.length}
              color="error"
              icon={'icon-park-solid:file-failed'}
              rows={targetOut}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Percentage
              title='Persentase'
              value={rate.toFixed(1)}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={12}>
            <Card>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="h6" sx={{ pl: 3, pt: 3, pb: 1 }}>
                  Ticket Handle Last Week
                </Typography>
                {/* <Box sx={{ pr: 5, pt: 3, pb: 1 }}>
                  <CSVLink data={jenisTiket} filename={'file.csv'}>
                    Download CSV
                  </CSVLink>
                </Box> */}
              </Stack>
              <Box
                sx={{
                  height: 400,
                  padding: 1,
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
                    // color: '#1a3e72',
                    fontWeight: '600',
                  },
                  '& .super-app.in': {
                    // backgroundColor: 'rgba(157, 255, 118, 0.49)',
                    color: '#2e7d32',
                    fontWeight: '800',
                  },
                  '& .super-app.out': {
                    // backgroundColor: 'rgba(157, 255, 118, 0.49)',
                    color: '#d32f2f',
                    fontWeight: '800',
                  },
                }}
              >
                <DataGrid hideFooter="true" rows={listTanggal} columns={columns} />
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <AppWebsiteVisits
              title="Tiket Selesai Per Minggu"
              subheader="ATM Section"
              chartLabels={minggu}
              chartData={[
                {
                  name: 'Tiket Selesai',
                  type: 'bar',
                  fill: 'solid',
                  data: total,
                },
                {
                  name: 'Sesuai Target',
                  type: 'bar',
                  fill: 'solid',
                  data: totalIn,
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <PerformaTable
              header='Kantor Cabang'
              title='Performa Kantor Cabang'
              rows={listKanca}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <AppConversionRates
              title="Top 5 Jenis Masalah"
              subheader="ATM Section"
              chartData={newJenisTiket.map((item) => {
                const newItem = { label: item.nama, value: item.tiketClose };
                return newItem;
              })}
              header='Jenis Masalah'
              rows={jenisTiket}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <PerformaTable 
              header='Implementor'
              title='Performa Implementor'
              rows={Implementor}
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
