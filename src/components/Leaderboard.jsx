import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  useTheme,
  alpha,
  styled
} from '@mui/material';
import { 
  OpenInNew,
  EmojiEvents,
  Star,
  EmojiEvents as TrophyIcon
} from '@mui/icons-material';

// Mock data
const mockKOLData = [
  {
    rank: 1,
    username: 'rayan',
    userId: '7bsTke',
    avatar: '🏆',
    metrics: { wins: 80, losses: 20 },
    solEarned: 185.15,
    usdValue: 37605.5,
    isHighlighted: true
  },
  {
    rank: 2,
    username: 'matteo',
    userId: 'CyaE1V',
    avatar: '🍊',
    metrics: { wins: 75, losses: 25 },
    solEarned: 109.69,
    usdValue: 22279.5
  },
  {
    rank: 3,
    username: 'dogendra',
    userId: 'ATFRUw',
    avatar: '👻',
    metrics: { wins: 65, losses: 35 },
    solEarned: 95.23,
    usdValue: 19345.2
  },
  {
    rank: 4,
    username: '0x3555...3535',
    userId: '2X4H5Y',
    avatar: '',
    metrics: { wins: 15, losses: 8 },
    solEarned: 87.45,
    usdValue: 17765.8
  },
  {
    rank: 5,
    username: '0x7A2B...9F4C',
    userId: '9KpL2M',
    avatar: '',
    metrics: { wins: 12, losses: 5 },
    solEarned: 76.32,
    usdValue: 15500.1
  },
  {
    rank: 6,
    username: '0x8E1D...6B3A',
    userId: '3NqR7S',
    avatar: '',
    metrics: { wins: 8, losses: 3 },
    solEarned: 65.78,
    usdValue: 13350.4
  },
  {
    rank: 7,
    username: '0x4F9C...2E7B',
    userId: '5TvW9X',
    avatar: '',
    metrics: { wins: 20, losses: 12 },
    solEarned: 58.91,
    usdValue: 11950.7
  },
  {
    rank: 8,
    username: '0x6B8A...1F3E',
    userId: '8YzA4B',
    avatar: '',
    metrics: { wins: 6, losses: 2 },
    solEarned: 52.34,
    usdValue: 10625.3
  },
  {
    rank: 9,
    username: '0x3D7F...9C2A',
    userId: '1HjK6L',
    avatar: '',
    metrics: { wins: 25, losses: 18 },
    solEarned: 48.67,
    usdValue: 9875.9
  },
  {
    rank: 10,
    username: '0x5E9B...4D8C',
    userId: '7MnP3Q',
    avatar: '',
    metrics: { wins: 14, losses: 9 },
    solEarned: 43.21,
    usdValue: 8750.2
  }
];


// Styled components
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  '& .MuiTableHead-root': {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
  }
}));

const RankCell = styled(TableCell)(({ theme, rank }) => ({
  fontWeight: 700,
  fontSize: '1.1rem',
  color: rank <= 3 ? theme.palette.primary.main : theme.palette.text.primary,
  textAlign: 'center',
  minWidth: 80,
  '& .rank-container': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(0.5)
  },
  '& .rank-number': {
    fontWeight: 800,
    fontSize: '1.2rem',
    background: rank <= 3 
      ? `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
      : 'none',
    WebkitBackgroundClip: rank <= 3 ? 'text' : 'initial',
    WebkitTextFillColor: rank <= 3 ? 'transparent' : 'inherit',
    textShadow: rank <= 3 ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
  }
}));

const UsernameCell = styled(TableCell)(({ theme, highlighted }) => ({
  fontWeight: 600,
  backgroundColor: 'transparent',
  borderLeft: 'none',
  '& .username-container': {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    justifyContent: 'flex-start'
  },
  '& .username-text': {
    fontWeight: 700,
    fontSize: '1.1rem',
    background: highlighted 
      ? `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
      : 'none',
    WebkitBackgroundClip: highlighted ? 'text' : 'initial',
    WebkitTextFillColor: highlighted ? 'transparent' : 'inherit',
    textShadow: highlighted ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
  },
  '& .trophy-icon': {
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
  }
}));

const MetricsCell = styled(TableCell)(({ theme }) => ({
  '& .win-loss': {
    display: 'flex',
    gap: theme.spacing(1.5),
    alignItems: 'center',
    justifyContent: 'center'
  },
  '& .MuiChip-root': {
    fontWeight: 700,
    fontSize: '0.85rem',
    height: 32,
    borderRadius: 16,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    '&.win': {
      background: `linear-gradient(45deg, ${theme.palette.success.main} 0%, ${theme.palette.success.light} 100%)`,
      color: 'white',
      '&:hover': {
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
      }
    },
    '&.loss': {
      background: `linear-gradient(45deg, ${theme.palette.error.main} 0%, ${theme.palette.error.light} 100%)`,
      color: 'white',
      '&:hover': {
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
      }
    }
  }
}));

const EarningsCell = styled(TableCell)(({ theme }) => ({
  '& .sol-amount': {
    color: theme.palette.success.main,
    fontWeight: 700,
    fontSize: '1.1rem',
    filter: 'blur(8px)',
    userSelect: 'none'
  },
  '& .usd-amount': {
    color: theme.palette.text.secondary,
    fontSize: '0.9rem',
    filter: 'blur(6px)',
    userSelect: 'none'
  }
}));


const Leaderboard = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toFixed(2);
  };

  return (
    <Box sx={{ py: 4, bgcolor: 'background.default', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        {/* Header */}
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
            Leaderboards
          </Typography>
        </Box>

        {/* Most Profitable Trader Leaderboard */}
        <Paper elevation={0} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ p: 3, borderBottom: `1px solid ${theme.palette.divider}` }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <EmojiEvents sx={{ color: 'primary.main', mr: 1, fontSize: 28 }} />
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Most Profitable Traders
              </Typography>
            </Box>
                
            <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
              <Tab label="Daily" />
              <Tab label="Weekly" />
              <Tab label="Monthly" />
            </Tabs>
          </Box>

          <StyledTableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }} align="center">Rank</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="left">Wallets</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="center">W/L Ratio</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">Total $ Traded</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockKOLData.map((user) => (
                  <TableRow key={user.rank} hover>
                    <RankCell rank={user.rank}>
                      <Box className="rank-container">
                        {user.rank <= 3 && <Star sx={{ fontSize: 18, color: 'warning.main' }} />}
                        <Typography className="rank-number">
                          {user.rank}
                        </Typography>
                      </Box>
                    </RankCell>
                    <UsernameCell highlighted={user.isHighlighted}>
                      <Box className="username-container">
                        <Typography className="username-text">
                          {user.username}
                        </Typography>
                        {user.rank <= 3 && (
                          <TrophyIcon 
                            className="trophy-icon" 
                            sx={{ 
                              fontSize: user.rank === 1 ? 24 : user.rank === 2 ? 20 : 16,
                              color: user.rank === 1 ? 'warning.main' : user.rank === 2 ? 'grey.600' : 'grey.500'
                            }} 
                          />
                        )}
                        <IconButton size="small" sx={{ ml: 0.5, p: 0.5 }}>
                          <OpenInNew sx={{ fontSize: 14 }} />
                        </IconButton>
                      </Box>
                    </UsernameCell>
                    <MetricsCell>
                      <Box className="win-loss">
                        <Chip 
                          label={`${Math.round((user.metrics.wins / (user.metrics.wins + user.metrics.losses)) * 100)}%`}
                          className="win"
                        />
                        <Chip 
                          label={`${Math.round((user.metrics.losses / (user.metrics.wins + user.metrics.losses)) * 100)}%`}
                          className="loss"
                        />
                      </Box>
                    </MetricsCell>
                    <EarningsCell align="right">
                      <Typography className="sol-amount">
                        +{user.solEarned} Sol
                      </Typography>
                      <Typography className="usd-amount">
                        (${formatNumber(user.usdValue)})
                      </Typography>
                    </EarningsCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </StyledTableContainer>
        </Paper>
      </Container>
    </Box>
  );
};

export default Leaderboard;
