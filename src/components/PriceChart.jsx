import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { 
  Box, 
  Typography, 
  Button, 
  ButtonGroup, 
  Paper, 
  IconButton,
  useTheme 
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BarChartIcon from '@mui/icons-material/BarChart';
import RefreshIcon from '@mui/icons-material/Refresh';

// ChartJS bileşenlerini kaydet
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const PriceChart = ({ tokenData }) => {
  const theme = useTheme();
  const [timeRange, setTimeRange] = useState('24h');
  const [isLoading, setIsLoading] = useState(false);

  if (!tokenData) return null;

  const { price, priceChange24h, priceHistory } = tokenData;

  // Mock price history data
  const generateMockHistory = () => {
    const basePrice = parseFloat(price || 1);
    const history = [];
    const now = new Date();
    
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - (i * 60 * 60 * 1000));
      const priceVariation = (Math.random() - 0.5) * 0.1; // ±5% variation
      const historicalPrice = basePrice * (1 + priceVariation);
      
      history.push({
        time: time.toISOString(),
        price: historicalPrice.toFixed(8),
        volume: Math.random() * 1000000
      });
    }
    
    return history;
  };

  const mockHistory = generateMockHistory();

  const chartData = {
    labels: mockHistory.map(item => 
      new Date(item.time).toLocaleTimeString('tr-TR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    ),
    datasets: [
      {
        label: 'Fiyat',
        data: mockHistory.map(item => parseFloat(item.price)),
        borderColor: theme.palette.primary.main,
        backgroundColor: `${theme.palette.primary.main}20`,
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: theme.palette.primary.main,
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            return `Fiyat: $${context.parsed.y.toFixed(6)}`;
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          maxTicksLimit: 6
        }
      },
      y: {
        display: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          callback: function(value) {
            return '$' + value.toFixed(6);
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const isPositive = parseFloat(priceChange24h || 0) >= 0;

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 3, 
        bgcolor: 'rgba(20, 20, 20, 0.8)',
        border: '1px solid rgba(255, 122, 24, 0.2)',
        borderRadius: 3,
        boxShadow: '0 20px 40px rgba(255, 122, 24, 0.15)'
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <BarChartIcon sx={{ color: 'primary.main' }} />
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
            Price Chart
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton 
            onClick={handleRefresh}
            disabled={isLoading}
            sx={{ 
              color: 'rgba(255,255,255,0.8)',
              '&:hover': { color: 'primary.main' }
            }}
          >
            <RefreshIcon sx={{ 
              animation: isLoading ? 'spin 1s linear infinite' : 'none',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' }
              }
            }} />
          </IconButton>
          
          <ButtonGroup variant="outlined" size="small">
            {['1h', '24h', '7d'].map((range) => (
              <Button
                key={range}
                onClick={() => setTimeRange(range)}
                variant={timeRange === range ? 'contained' : 'outlined'}
                sx={{
                  minWidth: 40,
                  '&.MuiButton-contained': {
                    bgcolor: 'primary.main',
                    color: '#050505'
                  }
                }}
              >
                {range}
              </Button>
            ))}
          </ButtonGroup>
        </Box>
      </Box>

      {/* Price Info */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, mb: 1 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, color: 'white' }}>
            ${parseFloat(price || 0).toFixed(6)}
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 0.5,
            px: 2, 
            py: 0.5,
            borderRadius: 2,
            bgcolor: isPositive ? 'success.main' : 'error.main',
            color: 'white'
          }}>
            {isPositive ? (
              <TrendingUpIcon sx={{ fontSize: 16 }} />
            ) : (
              <TrendingDownIcon sx={{ fontSize: 16 }} />
            )}
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {Math.abs(parseFloat(priceChange24h || 0)).toFixed(2)}%
            </Typography>
          </Box>
        </Box>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
          Change in last 24 hours
        </Typography>
      </Box>

      {/* Chart */}
      <Box sx={{ height: 300, position: 'relative' }}>
        {chartData.labels.length > 0 ? (
          <Line data={chartData} options={options} />
        ) : (
          <Box sx={{ 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'rgba(255,255,255,0.8)'
          }}>
            <Box sx={{ textAlign: 'center' }}>
              <AccessTimeIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography>Loading data...</Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default PriceChart;