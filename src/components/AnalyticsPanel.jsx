import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Chip, 
  LinearProgress, 
  useTheme,
  Button,
  Modal,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
  Stack
} from '@mui/material';
import ShieldIcon from '@mui/icons-material/Shield';
import WarningIcon from '@mui/icons-material/Warning';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BarChartIcon from '@mui/icons-material/BarChart';
import CloseIcon from '@mui/icons-material/Close';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import BubbleChartIcon from '@mui/icons-material/BubbleChart';

const AnalyticsPanel = ({ tokenData }) => {
  const theme = useTheme();
  const [bundleModalOpen, setBundleModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [connectedWallets, setConnectedWallets] = useState([]);
  const [walletConnections, setWalletConnections] = useState(new Map());
  const walletsPerPage = 10;

  if (!tokenData) return null;

  const { analytics, launchScore, sniperAlerts, isNewToken } = tokenData;

  // Generate 50 mock bundle data - fixed data that never changes
  const generateBundleData = () => {
    const data = [];
    for (let i = 0; i < 50; i++) {
      const percentage = Math.max(0.5, (50 - i) * 0.3 + Math.random() * 2);
      const amount = percentage > 10 ? `${(percentage * 0.2).toFixed(1)}M` : 
                    percentage > 5 ? `${(percentage * 0.4).toFixed(1)}M` : 
                    `${(percentage * 0.8).toFixed(0)}K`;
      data.push({
        address: `0x${Math.random().toString(16).substr(2, 4).toUpperCase()}...${Math.random().toString(16).substr(2, 4).toUpperCase()}`,
        percentage: parseFloat(percentage.toFixed(1)),
        amount: amount,
        connections: Math.floor(Math.random() * 5) + 1,
        id: i
      });
    }
    return data.sort((a, b) => b.percentage - a.percentage);
  };

  // Generate data once and never change it
  const bundleData = React.useMemo(() => generateBundleData(), []);
  
  // Calculate total bundle percentage
  const totalBundlePercentage = bundleData.reduce((sum, wallet) => sum + wallet.percentage, 0);
  const bundlePercentage = Math.min(100, totalBundlePercentage.toFixed(1));
  const totalPages = Math.ceil(bundleData.length / walletsPerPage);
  const currentWallets = bundleData.slice(currentPage * walletsPerPage, (currentPage + 1) * walletsPerPage);

  // Generate wallet connections once and store them
  React.useEffect(() => {
    const connections = new Map();
    bundleData.forEach(wallet => {
      const otherWallets = bundleData
        .filter(w => w.address !== wallet.address)
        .sort(() => Math.random() - 0.5)
        .slice(0, wallet.connections);
      connections.set(wallet.address, otherWallets);
    });
    setWalletConnections(connections);
  }, []);

  // Generate fixed bubble positions - spread across entire area
  const generateBubblePositions = (count) => {
    const positions = [];
    const containerWidth = 800; // Much wider container
    const containerHeight = 350; // Container height
    const minDistance = 40; // Smaller minimum distance for more spread
    const margin = 50; // Margin to keep bubbles inside container
    
    for (let i = 0; i < count; i++) {
      let attempts = 0;
      let position;
      
      do {
        // Random position across entire area with more spread, but within bounds
        const x = (Math.random() - 0.5) * (containerWidth - margin * 2);
        const y = (Math.random() - 0.5) * (containerHeight - margin * 2);
        
        position = {
          x,
          y,
          angle: Math.atan2(y, x) * (180 / Math.PI),
          radius: Math.sqrt(x*x + y*y)
        };
        attempts++;
      } while (
        attempts < 100 && 
        positions.some(pos => 
          Math.sqrt((position.x - pos.x) ** 2 + (position.y - pos.y) ** 2) < minDistance
        )
      );
      
      positions.push(position);
    }
    
    return positions;
  };

  // Generate positions once and never change them - 50 bubbles for 50 wallets
  const bubblePositions = React.useMemo(() => generateBubblePositions(50), []);

const getScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getScoreText = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Average';
    return 'Poor';
  };

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 3, 
        bgcolor: 'rgba(60, 60, 60, 0.9)',
        border: '1px solid rgba(255, 122, 24, 0.2)',
        borderRadius: 3,
        boxShadow: '0 20px 40px rgba(255, 122, 24, 0.15)'
      }}
    >
      <Typography 
        variant="h5" 
        component="h2" 
        sx={{ 
          mb: 3, 
          fontWeight: 700,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <BarChartIcon />
        Token Analysis
      </Typography>

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        gap: 6,
        flexWrap: 'wrap',
        py: 2
      }}>
        {/* Bundle */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          minWidth: 280
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <BubbleChartIcon sx={{ mr: 1, color: 'primary.main', fontSize: 28 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
              Bundle
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => setBundleModalOpen(true)}
            startIcon={<AccountBalanceWalletIcon />}
            sx={{
              width: '100%',
              py: 2,
              px: 4,
              borderRadius: 3,
              background: 'linear-gradient(45deg, #ff7a18 0%, #ffd200 100%)',
              color: 'white',
              fontWeight: 700,
              fontSize: '1.1rem',
              textTransform: 'none',
              boxShadow: '0 4px 20px rgba(255, 122, 24, 0.3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #e66a00 0%, #e6c200 100%)',
                transform: 'translateY(-3px)',
                boxShadow: '0 8px 30px rgba(255, 122, 24, 0.4)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            View Bundle Wallets ({bundleData.length})
          </Button>
        </Box>

        {/* Sniper Alerts */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          minWidth: 280
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <WarningIcon sx={{ mr: 1, color: 'warning.main', fontSize: 28 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
              Sniper Alerts
            </Typography>
          </Box>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            width: '100%',
            py: 2,
            px: 4,
            borderRadius: 3,
            bgcolor: sniperAlerts > 2 ? 'error.main' : sniperAlerts > 0 ? 'warning.main' : 'success.main',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
          }}>
            <Typography variant="h4" sx={{ 
              fontWeight: 700, 
              color: 'white',
              textAlign: 'center'
            }}>
              {sniperAlerts || 0} Alert{(sniperAlerts || 0) !== 1 ? 's' : ''}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Bundle Modal */}
      <Modal
        open={bundleModalOpen}
        onClose={() => setBundleModalOpen(false)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2
        }}
      >
        <Paper
          sx={{
            width: { xs: '98%', md: '95%', lg: '90%' },
            maxWidth: 1400,
            maxHeight: '95vh',
            overflow: 'auto',
            bgcolor: 'rgba(20, 20, 20, 1)',
            border: '1px solid rgba(255, 122, 24, 0.3)',
            borderRadius: 3,
            boxShadow: '0 20px 60px rgba(0,0,0,0.8)'
          }}
        >
          {/* Header */}
          <Box sx={{ p: 3, borderBottom: '1px solid rgba(255, 122, 24, 0.2)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BubbleChartIcon sx={{ color: 'primary.main', fontSize: 28 }} />
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
                  {tokenData?.symbol || 'ETH'} Bundle Wallet Distribution
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
                  {bundlePercentage}% Bundle Coverage
                </Typography>
              </Box>
            </Box>
              <IconButton 
                onClick={() => setBundleModalOpen(false)}
                sx={{ color: 'rgba(255,255,255,0.7)' }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            <Typography variant="body2" sx={{ mt: 1, color: 'rgba(255,255,255,0.8)' }}>
              Top {bundleData.length} wallets holding {bundlePercentage}% of {tokenData?.symbol || 'ETH'} supply
            </Typography>
          </Box>

          {/* Content */}
          <Box sx={{ p: 0 }}>
            {/* Bubble Map Visualization - Full Width */}
            <Box sx={{ 
              height: 350, 
              bgcolor: 'rgba(0,0,0,1)', 
              position: 'relative',
              overflow: 'hidden',
              background: 'radial-gradient(circle at center, rgba(255, 122, 24, 0.1) 0%, rgba(0,0,0,1) 100%)'
            }}>
              {/* Animated Background Particles */}
              {[...Array(20)].map((_, i) => (
                <Box
                  key={`particle-${i}`}
                  sx={{
                    position: 'absolute',
                    width: Math.random() * 4 + 2,
                    height: Math.random() * 4 + 2,
                    bgcolor: 'rgba(255, 122, 24, 0.3)',
                    borderRadius: '50%',
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 2}s`,
                    '@keyframes float': {
                      '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
                      '50%': { transform: `translateY(${Math.random() * 20 - 10}px) translateX(${Math.random() * 20 - 10}px)` }
                    }
                  }}
                />
              ))}

              {/* Bubble Map Container */}
              <Box sx={{ 
                position: 'relative', 
                height: '100%', 
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {/* Central Hub with Animation */}
                <Box sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: 'rgba(255, 122, 24, 0.8)',
                  border: '3px solid rgba(255, 122, 24, 1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10,
                  boxShadow: '0 0 30px rgba(255, 122, 24, 0.6)',
                  animation: 'pulse 2s ease-in-out infinite',
                  '@keyframes pulse': {
                    '0%, 100%': { boxShadow: '0 0 30px rgba(255, 122, 24, 0.6)' },
                    '50%': { boxShadow: '0 0 50px rgba(255, 122, 24, 0.9)' }
                  }
                }}>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                    HUB
                  </Typography>
                </Box>

                {/* Wallet Bubbles positioned around the hub with animations */}
                {bundleData.map((wallet, index) => {
                  const position = bubblePositions[index];
                  const x = position.x;
                  const y = position.y;
                  const isSelected = selectedWallet && selectedWallet.address === wallet.address;
                  
                  // Check if this wallet is connected to selected wallet
                  const isConnected = selectedWallet && selectedWallet.address !== wallet.address && 
                    walletConnections.get(selectedWallet.address)?.some(w => w.address === wallet.address);
                  
                  const isDimmed = selectedWallet && selectedWallet.address !== wallet.address && !isConnected;
                  
                  return (
                    <Tooltip 
                      key={wallet.id}
                      title={`${wallet.address} - ${wallet.percentage}% (${wallet.amount})`}
                      arrow
                    >
                      <Box
                        onClick={() => {
                          setSelectedWallet(wallet);
                          // Get pre-calculated connected wallets
                          const connected = walletConnections.get(wallet.address) || [];
                          setConnectedWallets(connected);
                        }}
                        sx={{
                          position: 'absolute',
                          left: `calc(50% + ${x}px)`,
                          top: `calc(50% + ${y}px)`,
                          transform: 'translate(-50%, -50%)',
                          width: Math.max(50, wallet.percentage * 2.5),
                          height: Math.max(50, wallet.percentage * 2.5),
                          borderRadius: '50%',
                          bgcolor: isSelected 
                            ? `rgba(255, 122, 24, 0.9)` 
                            : isConnected
                              ? `rgba(255, 122, 24, 0.7)`
                              : isDimmed 
                                ? `rgba(255, 122, 24, 0.2)` 
                                : `rgba(255, 122, 24, ${0.4 + (wallet.percentage / 30)})`,
                          border: isSelected 
                            ? '3px solid rgba(255, 122, 24, 1)' 
                            : isConnected
                              ? '2px solid rgba(255, 122, 24, 1)'
                              : '2px solid rgba(255, 122, 24, 0.9)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          zIndex: isSelected ? 15 : 5,
                          animation: isSelected ? 'none' : `bubbleFloat ${2 + Math.random() * 2}s ease-in-out infinite`,
                          animationDelay: `${Math.random() * 2}s`,
                          opacity: isDimmed ? 0.3 : 1,
                          '&:hover': {
                            transform: 'translate(-50%, -50%) scale(1.3)',
                            boxShadow: '0 0 30px rgba(255, 122, 24, 0.8)',
                            zIndex: 15,
                            animation: 'none'
                          },
                          '@keyframes bubbleFloat': {
                            '0%, 100%': { transform: 'translate(-50%, -50%) scale(1)' },
                            '50%': { transform: 'translate(-50%, -50%) scale(1.05)' }
                          }
                        }}
                      >
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: 'white', 
                            fontWeight: 700,
                            fontSize: Math.max(10, wallet.percentage / 3),
                            textAlign: 'center'
                          }}
                        >
                          {wallet.percentage}%
                        </Typography>
                      </Box>
                    </Tooltip>
                  );
                })}

                {/* Animated Connection Lines - Show only for selected wallet */}
                {selectedWallet && (() => {
                  // Find the selected wallet's position in bubble map
                  const selectedWalletIndex = bundleData.findIndex(w => w.address === selectedWallet.address);
                  if (selectedWalletIndex === -1) return null;
                  
                  const selectedPosition = bubblePositions[selectedWalletIndex];
                  
                  return connectedWallets.map((wallet, index) => {
                    const walletIndex = bundleData.findIndex(w => w.address === wallet.address);
                    const targetPosition = bubblePositions[walletIndex];
                    
                    const dx = targetPosition.x - selectedPosition.x;
                    const dy = targetPosition.y - selectedPosition.y;
                    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    // Calculate bubble radius to stop line at bubble edge
                    const selectedWalletData = bundleData.find(w => w.address === selectedWallet.address);
                    const targetWalletData = wallet;
                    const selectedBubbleRadius = Math.max(25, selectedWalletData.percentage * 1.25);
                    const targetBubbleRadius = Math.max(25, targetWalletData.percentage * 1.25);
                    const adjustedDistance = distance - selectedBubbleRadius - targetBubbleRadius;
                    
                    return (
                      <Box
                        key={`line-${wallet.id}`}
                        sx={{
                          position: 'absolute',
                          top: `calc(50% + ${selectedPosition.y}px)`,
                          left: `calc(50% + ${selectedPosition.x}px)`,
                          width: `${Math.max(10, adjustedDistance)}px`,
                          height: '3px',
                          bgcolor: 'rgba(255, 122, 24, 0.8)',
                          transformOrigin: '0 50%',
                          transform: `rotate(${angle}deg)`,
                          zIndex: 10,
                          animation: `linePulse ${2 + Math.random() * 1}s ease-in-out infinite`,
                          animationDelay: `${Math.random() * 1}s`,
                          '@keyframes linePulse': {
                            '0%, 100%': { 
                              opacity: 0.8, 
                              transform: `rotate(${angle}deg) scaleX(1)` 
                            },
                            '50%': { 
                              opacity: 1, 
                              transform: `rotate(${angle}deg) scaleX(1.1)` 
                            }
                          }
                        }}
                      />
                    );
                  });
                })()}
              </Box>
            </Box>

            {/* Wallet List - Bottom */}
            <Box sx={{ p: 3, bgcolor: 'rgba(0,0,0,1)' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ color: 'white' }}>
                  Wallet Distribution Details
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  Showing {currentPage * walletsPerPage + 1}-{Math.min((currentPage + 1) * walletsPerPage, bundleData.length)} of {bundleData.length} wallets
                </Typography>
              </Box>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600, fontSize: '0.9rem' }}>#</TableCell>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600, fontSize: '0.9rem' }}>Wallet Address</TableCell>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600, fontSize: '0.9rem' }}>Percentage</TableCell>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600, fontSize: '0.9rem' }}>Amount</TableCell>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600, fontSize: '0.9rem' }}>Connections</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentWallets.map((wallet, index) => {
                      const isSelected = selectedWallet && selectedWallet.address === wallet.address;
                      return (
                        <TableRow 
                          key={wallet.id} 
                          hover 
                          onClick={() => {
                            setSelectedWallet(wallet);
                            // Get pre-calculated connected wallets
                            const connected = walletConnections.get(wallet.address) || [];
                            setConnectedWallets(connected);
                          }}
                          sx={{ 
                            cursor: 'pointer',
                            bgcolor: isSelected ? 'rgba(255, 122, 24, 0.2)' : 'transparent',
                            '&:hover': { bgcolor: 'rgba(255, 122, 24, 0.1)' }
                          }}
                        >
                          <TableCell sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>
                            {currentPage * walletsPerPage + index + 1}
                          </TableCell>
                          <TableCell sx={{ color: 'white', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                            {wallet.address}
                          </TableCell>
                          <TableCell sx={{ color: 'primary.main', fontWeight: 700, fontSize: '1rem' }}>
                            {wallet.percentage}%
                          </TableCell>
                          <TableCell sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>
                            {wallet.amount}
                          </TableCell>
                          <TableCell sx={{ color: 'rgba(255,255,255,0.8)' }}>
                            {wallet.connections} connections
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Stack spacing={2}>
                  <Pagination
                    count={totalPages}
                    page={currentPage + 1}
                    onChange={(event, page) => setCurrentPage(page - 1)}
                    color="primary"
                    size="large"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        color: 'rgba(255,255,255,0.8)',
                        '&.Mui-selected': {
                          backgroundColor: 'rgba(255, 122, 24, 0.8)',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 122, 24, 0.9)',
                          }
                        },
                        '&:hover': {
                          backgroundColor: 'rgba(255, 122, 24, 0.2)',
                        }
                      }
                    }}
                  />
                </Stack>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Modal>
    </Paper>
  );
};

export default AnalyticsPanel;
