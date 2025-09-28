import React, { useState, useEffect, useMemo } from 'react';
import { Toaster } from 'react-hot-toast';
import { 
  ThemeProvider, 
  createTheme, 
  CssBaseline, 
  Container, 
  Box, 
  Typography, 
  Button, 
  Paper,
  Grid,
  Card,
  CardContent,
  useScrollTrigger,
  Slide,
  AppBar,
  Toolbar,
  IconButton,
  useTheme,
  Modal,
  Fade,
  Backdrop,
  TextField
} from '@mui/material';
import { indigo, deepPurple, teal, amber, red, blueGrey, grey } from '@mui/material/colors';
import TokenIcon from '@mui/icons-material/Token';
import SearchIcon from '@mui/icons-material/Search';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import BoltIcon from '@mui/icons-material/Bolt';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';

// Components
import SearchBar from './components/SearchBar';
import TokenInfo from './components/TokenInfo';
import PriceChart from './components/PriceChart';
import AnalyticsPanel from './components/AnalyticsPanel';
import LoadingSpinner from './components/LoadingSpinner';
import Leaderboard from './components/Leaderboard';
import tokenDataService from './services/api';

// Custom theme with dark mode by default - GTE.xyz inspired
const getTheme = (mode = 'dark') => ({
  palette: {
    mode,
    primary: {
      main: '#ff7a18',
      light: '#ff9d4d',
      dark: '#c75c00',
    },
    secondary: {
      main: '#ff4500',
      light: '#ff7033',
      dark: '#c23300',
    },
    success: {
      main: '#10b981', // Green
      light: '#34d399',
      dark: '#059669',
    },
    warning: {
      main: '#f59e0b', // Amber
      light: '#fbbf24',
      dark: '#d97706',
    },
    error: {
      main: '#ef4444', // Red
      light: '#f87171',
      dark: '#dc2626',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    divider: mode === 'dark' ? 'rgba(0,0,0,0.12)' : 'rgba(0,0,0,0.12)',
    text: {
      primary: mode === 'dark' ? 'rgba(0, 0, 0, 0.87)' : 'rgba(0, 0, 0, 0.87)',
      secondary: mode === 'dark' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.6)',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '3rem',
      fontWeight: 800,
      background: 'linear-gradient(45deg, #ff7a18 0%, #ffd200 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '1rem',
      lineHeight: 1.2,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontSize: '2.25rem',
      fontWeight: 700,
      marginBottom: '1rem',
      letterSpacing: '-0.02em',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      letterSpacing: '-0.015em',
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
    subtitle1: {
      fontSize: '1.25rem',
      color: 'text.secondary',
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 14px 0 rgba(0,0,0,0.1)',
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.2s ease',
        },
        contained: {
          '&:hover': {
            boxShadow: '0 6px 16px 0 rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 8px 32px 0 rgba(0,0,0,0.05)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 40px 0 rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            '& fieldset': {
              borderWidth: 2,
            },
            '&:hover fieldset': {
              borderColor: 'primary.light',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'primary.main',
              boxShadow: '0 0 0 4px rgba(99, 102, 241, 0.1)',
            },
          },
        },
      },
    },
  },
});

// Styled components
const GradientText = styled('span')(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, #ffd200 100%)`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 700,
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(3),
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: `0 16px 32px 0 ${theme.palette.mode === 'dark' ? 'rgba(255,122,24,0.2)' : 'rgba(0,0,0,0.1)'}`,
    border: `1px solid ${theme.palette.primary.main}40`,
  },
  '&:active': {
    transform: 'translateY(-4px)',
  },
}));

const FeatureIcon = styled('div')(({ theme, color = 'primary' }) => ({
  width: 56,
  height: 56,
  borderRadius: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  color: theme.palette[color].main,
  backgroundColor: theme.palette.mode === 'dark' 
    ? `${theme.palette[color].main}20` 
    : `${theme.palette[color].light}40`,
  '& svg': {
    fontSize: 28,
  },
}));

// Scroll handler for AppBar
function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [tokenData, setTokenData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  
  // Liquidation Calculator States
  const [entryPrice, setEntryPrice] = useState('');
  const [leverage, setLeverage] = useState(null);
  const [collateralAmount, setCollateralAmount] = useState('');
  
  // TP/SL Calculator States
  const [tpEntryPrice, setTpEntryPrice] = useState('');
  const [tpLeverage, setTpLeverage] = useState(null);
  const [tpCollateralAmount, setTpCollateralAmount] = useState('');
  const [tpTargetPrice, setTpTargetPrice] = useState('');
  const [tpStopLoss, setTpStopLoss] = useState('');
  const [tpSide, setTpSide] = useState('long');
  
  // Calculator Tab State
  const [activeCalculatorTab, setActiveCalculatorTab] = useState('liquidation');
  
  const theme = useMemo(() => createTheme(getTheme(darkMode ? 'dark' : 'light')), [darkMode]);

  const handleSearch = async (query) => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setTokenData(null);
    
    try {
      const tokenData = await tokenDataService.fetchTokenData(query);
      setTokenData(tokenData);
      // Scroll to results
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message || 'Token bulunamadı. Lütfen token adını veya kontrat adresini kontrol edin.');
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (content) => {
    setModalContent(content);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalContent(null);
  };

  const handleNavigation = (page) => {
    setCurrentPage(page);
    if (page === 'home') {
      setSearchQuery('');
      setTokenData(null);
      setError(null);
      setIsLoading(false);
    }
  };

  // Hyperliquid-style DEX-perp liquidation calculation
  const calculateLiquidationPrice = () => {
    if (!entryPrice || !leverage || !collateralAmount) {
      return { long: 0, short: 0, bankruptcy: { long: 0, short: 0 }, qty: 0 };
    }

    const P0 = parseFloat(entryPrice);
    const L = parseFloat(leverage);
    const C = parseFloat(collateralAmount);
    const MMR = 0.005; // 0.5% maintenance margin rate

    if (P0 <= 0 || L <= 1 || C <= 0) {
      return { long: 0, short: 0, bankruptcy: { long: 0, short: 0 }, qty: 0 };
    }

    // Position quantity: q = (C * L) / P0
    const qty = (C * L) / P0;

    // Bankruptcy prices (pure liquidation without MMR)
    const longBankruptcy = P0 * (1 - 1 / L);
    const shortBankruptcy = P0 * (1 + 1 / L);

    // Liquidation prices with MMR
    // Long: P_liq = P0*(L-1)/(L*(1-MMR))
    const longLiquidation = (P0 * (L - 1)) / (L * (1 - MMR));
    
    // Short: P_liq = P0*(L+1)/(L*(1+MMR))
    const shortLiquidation = (P0 * (L + 1)) / (L * (1 + MMR));

    return {
      long: Math.max(0, longLiquidation),
      short: shortLiquidation,
      bankruptcy: {
        long: Math.max(0, longBankruptcy),
        short: shortBankruptcy
      },
      qty: qty
    };
  };

  const liquidationData = calculateLiquidationPrice();

  // TP/SL Calculator
  const calculateTPSL = () => {
    if (!tpEntryPrice || !tpLeverage || !tpCollateralAmount || (!tpTargetPrice && !tpStopLoss)) {
      return { 
        positionSize: 0, 
        targetGain: 0, 
        stopLoss: 0, 
        targetPercentage: 0, 
        stopLossPercentage: 0,
        isLiquidated: false
      };
    }

    const P0 = parseFloat(tpEntryPrice);
    const L = parseFloat(tpLeverage);
    const C = parseFloat(tpCollateralAmount);
    const targetPrice = parseFloat(tpTargetPrice || 0);
    const stopLossPrice = parseFloat(tpStopLoss || 0);

    if (P0 <= 0 || L <= 1 || C <= 0) {
      return { 
        positionSize: 0, 
        targetGain: 0, 
        stopLoss: 0, 
        targetPercentage: 0, 
        stopLossPercentage: 0,
        isLiquidated: false
      };
    }

    // Position size
    const positionSize = (C * L) / P0;

    // Calculate liquidation price (same as liquidation calculator)
    const MMR = 0.005; // 0.5% maintenance margin rate
    let liquidationPrice = 0;
    
    if (tpSide === 'long') {
      liquidationPrice = (P0 * (L - 1)) / (L * (1 - MMR));
    } else {
      liquidationPrice = (P0 * (L + 1)) / (L * (1 + MMR));
    }

    let targetGain = 0;
    let stopLoss = 0;
    let targetPercentage = 0;
    let stopLossPercentage = 0;
    let isLiquidated = false;

    if (tpSide === 'long') {
      if (targetPrice > 0) {
        targetGain = (targetPrice - P0) * positionSize;
        // For leveraged positions, calculate % based on collateral, not price
        targetPercentage = (targetGain / C) * 100;
      }
      if (stopLossPrice > 0) {
        // Check if stop loss is below liquidation price
        if (stopLossPrice <= liquidationPrice) {
          isLiquidated = true;
          stopLoss = -C; // Lose all collateral
          stopLossPercentage = -100; // 100% loss
        } else {
          // Calculate actual loss based on position size and price difference
          stopLoss = (stopLossPrice - P0) * positionSize;
          // For leveraged positions, calculate % based on collateral, not price
          stopLossPercentage = (stopLoss / C) * 100;
        }
      }
    } else {
      if (targetPrice > 0) {
        targetGain = (P0 - targetPrice) * positionSize;
        // For leveraged positions, calculate % based on collateral, not price
        targetPercentage = (targetGain / C) * 100;
      }
      if (stopLossPrice > 0) {
        // Check if stop loss is above liquidation price
        if (stopLossPrice >= liquidationPrice) {
          isLiquidated = true;
          stopLoss = -C; // Lose all collateral
          stopLossPercentage = -100; // 100% loss
        } else {
          // Calculate actual loss based on position size and price difference
          stopLoss = (P0 - stopLossPrice) * positionSize;
          // For leveraged positions, calculate % based on collateral, not price
          stopLossPercentage = (stopLoss / C) * 100;
        }
      }
    }

    return {
      positionSize,
      targetGain,
      stopLoss,
      targetPercentage,
      stopLossPercentage,
      isLiquidated,
      liquidationPrice
    };
  };

  const tpSlData = calculateTPSL();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <style>
        {`
          body {
            background-color: #f8fafc !important;
          }
          html {
            background-color: #f8fafc !important;
          }
        `}
      </style>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: '12px',
            background: theme.palette.background.paper,
            color: theme.palette.text.primary,
            boxShadow: theme.shadows[4],
            border: `1px solid ${theme.palette.divider}`,
          },
        }}
      />

      {/* Header */}
      <HideOnScroll>
        <AppBar 
          elevation={0}
          sx={{
            bgcolor: 'rgba(255,255,255,0.95)',
            backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.95) 0%, rgba(255,248,240,0.95) 55%, rgba(255,240,220,0.95) 100%)',
            transition: 'all 0.3s ease',
            borderBottom: `1px solid ${theme.palette.divider}`,
            boxShadow: '0 10px 40px rgba(255, 122, 24, 0.16)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        >
          <Container maxWidth="lg">
            <Toolbar disableGutters sx={{ py: 1 }}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  flexGrow: 1,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  }
                }}
                onClick={() => {
                  handleNavigation('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(255,122,24,0.9) 0%, rgba(255,210,0,0.9) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 1.5,
                    boxShadow: '0 10px 30px rgba(255,122,24,0.35)',
                  }}
                >
                  <TokenIcon sx={{ color: '#050505' }} />
                </Box>
                <Typography variant="h6" component="div" sx={{ fontWeight: 700, letterSpacing: '-0.6px', textTransform: 'uppercase' }}>
                  Gte<Box component="span" sx={{ color: 'primary.main' }}>Scope</Box>
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button 
                  variant="contained" 
                  color="primary"
                  startIcon={<SearchIcon />}
                  onClick={() => {
                    handleNavigation('home');
                    setTimeout(() => {
                      document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    fontWeight: 700,
                    px: 3,
                    borderRadius: 3,
                    boxShadow: '0 14px 30px rgba(255, 122, 24, 0.3)',
                    '&:hover': {
                      bgcolor: 'primary.light',
                      boxShadow: '0 16px 34px rgba(255, 122, 24, 0.36)',
                    },
                    '& .MuiSvgIcon-root': {
                      color: 'white'
                    }
                  }}
                >
                  Search Token
                </Button>
                <Button 
                  variant="outlined"
                  color="primary"
                  onClick={() => handleNavigation('leaderboard')}
                  sx={{
                    fontWeight: 600,
                    px: 3,
                    borderRadius: 3,
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: 'primary.main',
                      color: '#050505',
                    }
                  }}
                >
                  Leaderboards
                </Button>
                <Button 
                  variant="outlined"
                  color="primary"
                  onClick={() => handleNavigation('calculations')}
                  sx={{
                    fontWeight: 600,
                    px: 3,
                    borderRadius: 3,
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: 'primary.main',
                      color: '#050505',
                    }
                  }}
                >
                  Calculations
                </Button>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </HideOnScroll>

      <Box component="main">
        {currentPage === 'leaderboard' ? (
          <Leaderboard />
        ) : currentPage === 'calculations' ? (
          <Box sx={{ py: 4, bgcolor: 'background.default', minHeight: '100vh' }}>
            <Container maxWidth="lg">
              <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Typography 
                  variant="h3" 
                  component="h1" 
                  sx={{ 
                    fontWeight: 800,
                    background: 'linear-gradient(45deg, #ff7a18 0%, #ffd200 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 2
                  }}
                >
                  Calculations
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                  Advanced token analysis calculations and metrics
                </Typography>
              </Box>
              
            {/* Calculator Tabs */}
            <Paper elevation={0} sx={{ p: 4, borderRadius: 3, mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box sx={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: 2, 
                  bgcolor: 'primary.main', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  mr: 2
                }}>
                  <Typography sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>
                    ⚡
                  </Typography>
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Trading Calculator
                </Typography>
              </Box>

              {/* Tab Navigation */}
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant={activeCalculatorTab === 'liquidation' ? "contained" : "outlined"}
                    onClick={() => setActiveCalculatorTab('liquidation')}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 3,
                      py: 1
                    }}
                  >
                    Liquidation Price
                  </Button>
                  <Button
                    variant={activeCalculatorTab === 'tpsl' ? "contained" : "outlined"}
                    onClick={() => setActiveCalculatorTab('tpsl')}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 3,
                      py: 1
                    }}
                  >
                    TP / SL Calculator
                  </Button>
                </Box>
              </Box>

              {/* Calculator Content */}
              {activeCalculatorTab === 'liquidation' && (
                <Grid container spacing={4}>
                  {/* Input Section */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                        Entry Price ($)
                      </Typography>
                      <TextField
                        fullWidth
                        type="number"
                        placeholder="0.00"
                        value={entryPrice}
                        onChange={(e) => setEntryPrice(e.target.value)}
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            fontSize: '1.1rem',
                            fontWeight: 600
                          }
                        }}
                      />
                    </Box>
                    
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                        Leverage
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {[2, 3, 4, 5, 10, 20, 25, 50, 75, 100].map((lev) => (
                          <Button
                            key={lev}
                            variant={leverage === lev ? "contained" : "outlined"}
                            size="small"
                            onClick={() => setLeverage(lev)}
                            sx={{
                              minWidth: 50,
                              borderRadius: 2,
                              fontWeight: 600,
                              bgcolor: leverage === lev ? 'primary.main' : 'transparent',
                              color: leverage === lev ? 'white' : 'primary.main',
                              borderColor: 'primary.main',
                              '&:hover': {
                                bgcolor: 'primary.main',
                                color: 'white',
                                borderColor: 'primary.main'
                              }
                            }}
                          >
                            {lev}x
                          </Button>
                        ))}
                      </Box>
                    </Box>
                    
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                        Collateral Amount ($)
                      </Typography>
                      <TextField
                        fullWidth
                        type="number"
                        placeholder="0.00"
                        value={collateralAmount}
                        onChange={(e) => setCollateralAmount(e.target.value)}
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            fontSize: '1.1rem',
                            fontWeight: 600
                          }
                        }}
                      />
                    </Box>
                  </Grid>
                  
                  {/* Results Section */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{ 
                      p: 3, 
                      bgcolor: 'rgba(255, 122, 24, 0.05)', 
                      borderRadius: 3,
                      border: '1px solid rgba(255, 122, 24, 0.1)'
                    }}>
                      <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: 'primary.main' }}>
                        Position Details
                      </Typography>
                      
                      {/* Position Quantity */}
                      <Box sx={{ mb: 3, p: 2, bgcolor: 'rgba(0, 0, 0, 0.02)', borderRadius: 2 }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                          Position Size
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                          {liquidationData.qty.toFixed(2)} tokens
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                          ${parseFloat(entryPrice || 0).toFixed(4)} × {liquidationData.qty.toFixed(2)} = ${(parseFloat(entryPrice || 0) * liquidationData.qty).toFixed(2)}
                        </Typography>
                      </Box>

                      {/* Liquidation Prices */}
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1, fontWeight: 600 }}>
                          Long Liquidation Price
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                          ${liquidationData.long.toFixed(4)}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 600 }}>
                          {entryPrice ? `${(((liquidationData.long - parseFloat(entryPrice)) / parseFloat(entryPrice)) * 100).toFixed(2)}%` : '0.00%'} from entry
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Bankruptcy: ${liquidationData.bankruptcy.long.toFixed(4)} ({entryPrice ? `${(((liquidationData.bankruptcy.long - parseFloat(entryPrice)) / parseFloat(entryPrice)) * 100).toFixed(2)}%` : '0.00%'})
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1, fontWeight: 600 }}>
                          Short Liquidation Price
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: 'error.main' }}>
                          ${liquidationData.short.toFixed(4)}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'error.main', fontWeight: 600 }}>
                          {entryPrice ? `+${(((liquidationData.short - parseFloat(entryPrice)) / parseFloat(entryPrice)) * 100).toFixed(2)}%` : '+0.00%'} from entry
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Bankruptcy: ${liquidationData.bankruptcy.short.toFixed(4)} ({entryPrice ? `+${(((liquidationData.bankruptcy.short - parseFloat(entryPrice)) / parseFloat(entryPrice)) * 100).toFixed(2)}%` : '+0.00%'})
                        </Typography>
                      </Box>
                      
                      <Box sx={{ 
                        mt: 3, 
                        p: 2, 
                        bgcolor: 'rgba(0, 0, 0, 0.02)', 
                        borderRadius: 2,
                        border: '1px solid rgba(0, 0, 0, 0.05)'
                      }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem', mb: 1 }}>
                          💡 <strong>DEX-Perp Logic:</strong> Isolated margin with 0.5% MMR
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                          Higher leverage = Closer liquidation = Higher risk
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              )}

              {activeCalculatorTab === 'tpsl' && (
                <Grid container spacing={4}>
                  {/* Input Section */}
                  <Grid item xs={12} md={6}>
                    {/* Position Side */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                        Position Side
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant={tpSide === 'long' ? "contained" : "outlined"}
                          onClick={() => setTpSide('long')}
                          sx={{
                            borderRadius: 2,
                            fontWeight: 600,
                            flex: 1,
                            bgcolor: tpSide === 'long' ? 'success.main' : 'transparent',
                            color: tpSide === 'long' ? 'white' : 'success.main',
                            borderColor: 'success.main',
                            '&:hover': {
                              bgcolor: 'success.main',
                              color: 'white',
                              borderColor: 'success.main'
                            }
                          }}
                        >
                          Long
                        </Button>
                        <Button
                          variant={tpSide === 'short' ? "contained" : "outlined"}
                          onClick={() => setTpSide('short')}
                          sx={{
                            borderRadius: 2,
                            fontWeight: 600,
                            flex: 1,
                            bgcolor: tpSide === 'short' ? 'error.main' : 'transparent',
                            color: tpSide === 'short' ? 'white' : 'error.main',
                            borderColor: 'error.main',
                            '&:hover': {
                              bgcolor: 'error.main',
                              color: 'white',
                              borderColor: 'error.main'
                            }
                          }}
                        >
                          Short
                        </Button>
                      </Box>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                        Entry Price ($)
                      </Typography>
                      <TextField
                        fullWidth
                        type="number"
                        placeholder="0.00"
                        value={tpEntryPrice}
                        onChange={(e) => setTpEntryPrice(e.target.value)}
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            fontSize: '1.1rem',
                            fontWeight: 600
                          }
                        }}
                      />
                    </Box>
                    
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                        Leverage
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {[2, 3, 4, 5, 10, 20, 25, 50, 75, 100].map((lev) => (
                          <Button
                            key={lev}
                            variant={tpLeverage === lev ? "contained" : "outlined"}
                            size="small"
                            onClick={() => setTpLeverage(lev)}
                            sx={{
                              minWidth: 50,
                              borderRadius: 2,
                              fontWeight: 600,
                              bgcolor: tpLeverage === lev ? 'primary.main' : 'transparent',
                              color: tpLeverage === lev ? 'white' : 'primary.main',
                              borderColor: 'primary.main',
                              '&:hover': {
                                bgcolor: 'primary.main',
                                color: 'white',
                                borderColor: 'primary.main'
                              }
                            }}
                          >
                            {lev}x
                          </Button>
                        ))}
                      </Box>
                    </Box>
                    
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                        Collateral Amount ($)
                      </Typography>
                      <TextField
                        fullWidth
                        type="number"
                        placeholder="0.00"
                        value={tpCollateralAmount}
                        onChange={(e) => setTpCollateralAmount(e.target.value)}
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            fontSize: '1.1rem',
                            fontWeight: 600
                          }
                        }}
                      />
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                        Target Price ($)
                      </Typography>
                      <TextField
                        fullWidth
                        type="number"
                        placeholder="0.00"
                        value={tpTargetPrice}
                        onChange={(e) => setTpTargetPrice(e.target.value)}
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            fontSize: '1.1rem',
                            fontWeight: 600
                          }
                        }}
                      />
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                        Stop Loss ($)
                      </Typography>
                      <TextField
                        fullWidth
                        type="number"
                        placeholder="0.00"
                        value={tpStopLoss}
                        onChange={(e) => setTpStopLoss(e.target.value)}
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            fontSize: '1.1rem',
                            fontWeight: 600
                          }
                        }}
                      />
                    </Box>
                  </Grid>
                  
                  {/* Results Section */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{ 
                      p: 3, 
                      bgcolor: 'rgba(76, 175, 80, 0.05)', 
                      borderRadius: 3,
                      border: '1px solid rgba(76, 175, 80, 0.1)'
                    }}>
                      <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: 'success.main' }}>
                        TP / SL Results
                      </Typography>
                      
                      {/* Position Size */}
                      <Box sx={{ mb: 3, p: 2, bgcolor: 'rgba(0, 0, 0, 0.02)', borderRadius: 2 }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                          Position Size
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: 'success.main' }}>
                          {tpSlData.positionSize.toFixed(2)} tokens
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                          ${parseFloat(tpEntryPrice || 0).toFixed(4)} × {tpSlData.positionSize.toFixed(2)} = ${(parseFloat(tpEntryPrice || 0) * tpSlData.positionSize).toFixed(2)}
                        </Typography>
                      </Box>

                      {/* Target Profit */}
                      {tpTargetPrice && (
                        <Box sx={{ mb: 2, p: 2, bgcolor: 'rgba(76, 175, 80, 0.1)', borderRadius: 2 }}>
                          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1, fontWeight: 600 }}>
                            Target Profit
                          </Typography>
                          <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                            +${tpSlData.targetGain.toFixed(2)}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 600 }}>
                            +{tpSlData.targetPercentage.toFixed(2)}% from entry
                          </Typography>
                        </Box>
                      )}

                      {/* Stop Loss */}
                      {tpStopLoss && (
                        <Box sx={{ 
                          mb: 2, 
                          p: 2, 
                          bgcolor: tpSlData.isLiquidated ? 'rgba(244, 67, 54, 0.2)' : 'rgba(244, 67, 54, 0.1)', 
                          borderRadius: 2,
                          border: tpSlData.isLiquidated ? '2px solid #f44336' : '1px solid rgba(244, 67, 54, 0.1)'
                        }}>
                          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1, fontWeight: 600 }}>
                            {tpSlData.isLiquidated ? '⚠️ LIQUIDATED' : 'Stop Loss'}
                          </Typography>
                          <Typography variant="h4" sx={{ fontWeight: 700, color: 'error.main' }}>
                            {tpSlData.stopLoss >= 0 ? '+' : ''}${tpSlData.stopLoss.toFixed(2)}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'error.main', fontWeight: 600 }}>
                            {tpSlData.stopLossPercentage >= 0 ? '+' : ''}{tpSlData.stopLossPercentage.toFixed(2)}% from entry
                          </Typography>
                          {tpSlData.isLiquidated && (
                            <Typography variant="caption" sx={{ color: 'error.main', fontWeight: 600, display: 'block', mt: 1 }}>
                              Stop loss below liquidation price (${tpSlData.liquidationPrice.toFixed(4)})
                            </Typography>
                          )}
                        </Box>
                      )}
                      
                      <Box sx={{ 
                        mt: 3, 
                        p: 2, 
                        bgcolor: 'rgba(0, 0, 0, 0.02)', 
                        borderRadius: 2,
                        border: '1px solid rgba(0, 0, 0, 0.05)'
                      }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem', mb: 1 }}>
                          💡 <strong>TP/SL Logic:</strong> {tpSide === 'long' ? 'Long' : 'Short'} position calculations
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                          Set realistic targets based on market conditions
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              )}
            </Paper>
              
            {/* Additional Tools Placeholder */}
              <Paper elevation={0} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>
                  More Tools Coming Soon
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Position sizing, risk management, and advanced calculations
                </Typography>
              </Paper>
            </Container>
          </Box>
        ) : (
          <>
        {/* Hero Section - GTE.xyz benzeri tasarım */}
        <Box 
          sx={{ 
            pt: { xs: 12, md: 20 }, 
            pb: { xs: 16, md: 24 },
            background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
            position: 'relative',
            overflow: 'hidden',
            minHeight: '80vh',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {/* Arka plan efektleri */}
          <Box 
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.4,
              background: 'radial-gradient(circle at 20% 35%, rgba(255, 122, 24, 0.08) 0%, transparent 52%), radial-gradient(circle at 75% 44%, rgba(255, 69, 0, 0.06) 0%, transparent 55%)',
              zIndex: 0,
            }}
          />
          
          <Container maxWidth="lg" id="search-section" sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ 
              textAlign: 'center', 
              maxWidth: 800, 
              mx: 'auto', 
              px: { xs: 2, sm: 3 },
              animation: 'fadeIn 0.8s ease-out',
              '@keyframes fadeIn': {
                '0%': { opacity: 0, transform: 'translateY(20px)' },
                '100%': { opacity: 1, transform: 'translateY(0)' },
              },
            }}>
              <Typography 
                variant="h1" 
                component="h1" 
                sx={{
                  mb: 3,
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                  lineHeight: 1.1,
                  textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                  fontWeight: 800,
                  background: 'linear-gradient(45deg, #ff7a18 30%, #ffd200 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Gtescope
              </Typography>
              
              <Typography 
                variant="subtitle1" 
                sx={{
                  mb: 5,
                  fontSize: { xs: '1.1rem', md: '1.25rem' },
                  color: 'text.secondary',
                  maxWidth: 700,
                  mx: 'auto',
                  lineHeight: 1.6,
                  fontWeight: 400,
                  opacity: 0.9,
                }}
              >
                <GradientText>Bundle</GradientText>, <Box component="span" sx={{ color: 'secondary.light', fontWeight: 600 }}>sniper alerts</Box> analysis to manage your token investments safely.
              </Typography>
              
              {/* Search Section */}
              <Box 
                sx={{ 
                  maxWidth: 600, 
                  mx: 'auto', 
                  mb: { xs: 6, md: 8 },
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                  boxShadow: '0 18px 46px rgba(255, 122, 24, 0.28)',
                  borderRadius: 5,
                }}
              >
                <SearchBar 
                  onSearch={handleSearch}
                  isLoading={isLoading}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  placeholder="Enter token name or contract address..."
                />
              </Box>
            </Box>
          </Container>
        </Box>


        {/* Results Section */}
        {(tokenData || isLoading) && (
          <Box 
            id="results" 
            sx={{ 
              py: { xs: 4, md: 6 }, 
              bgcolor: '#f8fafc',
              borderTop: '1px solid rgba(0,0,0,0.05)',
            }}
          >
            <Container maxWidth="lg">
              {isLoading ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
                  <LoadingSpinner />
                </Box>
              ) : error ? (
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    bgcolor: 'rgba(255, 122, 24, 0.1)', 
                    color: '#d97706',
                    borderRadius: 3,
                    textAlign: 'center',
                    border: '1px solid rgba(255,122,24,0.3)',
                    boxShadow: '0 4px 20px rgba(255,122,24,0.15)'
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Error</Typography>
                  <Typography sx={{ mt: 1.5 }}>{error}</Typography>
                  <Button 
                    variant="contained" 
                    color="error" 
                    sx={{ mt: 3, borderRadius: 3, px: 4 }}
                    onClick={() => setError(null)}
                  >
                    Try Again
                  </Button>
                </Paper>
              ) : tokenData ? (
                <Box>
                  {/* Token Info Component */}
                  <TokenInfo tokenData={tokenData} />
                  
                  {/* Price Chart Component */}
                  <Box sx={{ mt: 4 }}>
                    <PriceChart tokenData={tokenData} />
                  </Box>
                  
                  {/* Analytics Panel Component */}
                  <Box sx={{ mt: 4 }}>
                    <AnalyticsPanel tokenData={tokenData} />
                  </Box>
                </Box>
              ) : null}
              
            </Container>
          </Box>
        )}

        {/* Feature Modal */}
        <Modal
          open={modalOpen}
          onClose={closeModal}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
            sx: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(8px)',
            }
          }}
        >
          <Fade in={modalOpen}>
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: { xs: '90%', sm: '80%', md: '600px' },
                maxHeight: '80vh',
                bgcolor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid rgba(255, 122, 24, 0.2)',
                borderRadius: 4,
                boxShadow: '0 20px 60px rgba(255, 122, 24, 0.15)',
                outline: 'none',
                overflow: 'auto',
                backdropFilter: 'blur(20px)',
              }}
            >
              {modalContent && (
                <Box sx={{ p: 4 }}>
                  {/* Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {modalContent.icon}
                      <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        {modalContent.title}
                      </Typography>
                    </Box>
                    <IconButton 
                      onClick={closeModal}
                      sx={{ 
                        color: 'text.secondary',
                        '&:hover': { color: 'primary.main' }
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Box>

                  {/* Content */}
                  <Box sx={{ color: 'text.primary', lineHeight: 1.8 }}>
                    {modalContent.content}
                  </Box>

                  {/* Footer */}
                  <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="contained"
                      onClick={closeModal}
                      sx={{
                        bgcolor: 'primary.main',
                        color: '#ffffff',
                        px: 4,
                        py: 1.5,
                        borderRadius: 3,
                        fontWeight: 600,
                        '&:hover': {
                          bgcolor: 'primary.light',
                        }
                      }}
                    >
                      Got it!
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>
          </Fade>
        </Modal>
          </>
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App;
