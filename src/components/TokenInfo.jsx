import React, { useState, useEffect } from 'react';
import { styled, alpha } from '@mui/material/styles';
import { 
  Box, 
  Paper, 
  Typography, 
  Grid, 
  Avatar, 
  Chip, 
  IconButton, 
  Button, 
  Tooltip, 
  Link,
  Card,
  CardContent,
  Divider,
  useTheme
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import LanguageIcon from '@mui/icons-material/Language';
import TwitterIcon from '@mui/icons-material/Twitter';
import TelegramIcon from '@mui/icons-material/Telegram';
import LinkIcon from '@mui/icons-material/Link';
import LaunchIcon from '@mui/icons-material/Launch';
import { toast } from 'react-hot-toast';

// Yardımcı fonksiyonlar
const formatNumber = (num) => {
  if (num === undefined || num === null) return 'N/A';
  const number = typeof num === 'string' ? parseFloat(num.replace(/[^0-9.-]+/g, '')) : num;
  if (isNaN(number)) return 'N/A';
  if (number >= 1e9) return `$${(number / 1e9).toFixed(2)}B`;
  if (number >= 1e6) return `$${(number / 1e6).toFixed(2)}M`;
  if (number >= 1e3) return `$${(number / 1e3).toFixed(2)}K`;
  return `$${number.toFixed(2)}`;
};

const formatPrice = (price) => {
  if (!price && price !== 0) return 'N/A';
  const num = typeof price === 'string' ? parseFloat(price.replace(/[^0-9.-]+/g, '')) : price;
  if (isNaN(num)) return 'N/A';
  if (num < 0.000001) return `$${num.toExponential(2)}`;
  if (num < 0.01) return `$${num.toFixed(6)}`;
  if (num < 1) return `$${num.toFixed(4)}`;
  return `$${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const formatPercentage = (value) => {
  if (value === undefined || value === null) return 'N/A';
  const num = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]+/g, '')) : value;
  if (isNaN(num)) return 'N/A';
  return `${num >= 0 ? '+' : ''}${num.toFixed(2)}%`;
};

const formatAddress = (address) => {
  if (!address) return 'N/A';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

const TokenCard = styled(Card)(({ theme }) => ({
  background: '#ffffff',
  borderRadius: 16,
  border: '1px solid rgba(0, 0, 0, 0.08)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
    transform: 'translateY(-2px)',
  },
  overflow: 'visible'
}));

const TokenAvatar = styled(Avatar)(({ theme }) => ({
  width: 48,
  height: 48,
  background: '#ff7a18',
  boxShadow: '0 2px 8px rgba(255, 122, 24, 0.3)',
  fontSize: 20,
  fontWeight: 'bold',
  color: '#ffffff',
  border: 'none',
}));

const StatBox = styled(Box)(({ theme }) => ({
  padding: '16px',
  borderRadius: 12,
  background: '#ffffff',
  border: '1px solid rgba(0, 0, 0, 0.06)',
  transition: 'all 0.2s ease',
  '&:hover': {
    background: '#fafafa',
    border: '1px solid rgba(0, 0, 0, 0.1)',
  }
}));

const ContractBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1.5, 2),
  borderRadius: 12,
  background: alpha(theme.palette.background.default, 0.5),
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  fontFamily: 'monospace',
  fontSize: '0.85rem',
  color: 'rgba(255,255,255,0.8)',
}));

const SocialButton = styled(Button)(({ theme, colorhue }) => ({
  borderRadius: 8,
  padding: theme.spacing(0.75, 2),
  background: alpha(theme.palette[colorhue || 'primary'].main, 0.1),
  color: theme.palette[colorhue || 'primary'].main,
  border: `1px solid ${alpha(theme.palette[colorhue || 'primary'].main, 0.3)}`,
  '&:hover': {
    background: alpha(theme.palette[colorhue || 'primary'].main, 0.2),
  },
  textTransform: 'none',
}));

const TokenInfo = ({ tokenData }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [timeSinceLaunch, setTimeSinceLaunch] = useState('');
  const theme = useTheme();
  
  // Kopyalama işlemi için
  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    toast.success('Kopyalandı!', {
      position: 'top-center',
      style: {
        background: theme.palette.background.paper,
        color: 'white',
        border: `1px solid ${theme.palette.primary.main}40`,
        padding: '8px 16px',
        borderRadius: '8px',
        fontSize: '14px',
      },
    });
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Token'ın ne kadar süre önce oluşturulduğunu hesapla
  useEffect(() => {
    if (!tokenData?.createdAt) return;
    
    const calculateTimeSince = () => {
      const now = new Date();
      const createdAt = tokenData.createdAt ? new Date(tokenData.createdAt) : new Date();
      const diffInSeconds = Math.floor((now - createdAt) / 1000);
      
      if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    };
    
    setTimeSinceLaunch(calculateTimeSince());
    const interval = setInterval(() => setTimeSinceLaunch(calculateTimeSince()), 60000);
    
    return () => clearInterval(interval);
  }, [tokenData?.createdAt]);

  const isPositive = tokenData?.priceChange24h >= 0;
  const contractAddress = tokenData?.contract || tokenData?.address;

  if (!tokenData) return null;

  return (
    <TokenCard elevation={0}>
      <CardContent sx={{ p: 3 }}>
        {/* Header Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TokenAvatar>
              {tokenData.image ? (
                <img 
                  src={tokenData.image} 
                  alt={tokenData.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${tokenData.symbol}&background=ff7a18&color=fff`;
                  }}
                />
              ) : (
                tokenData.symbol?.charAt(0) || '?'
              )}
            </TokenAvatar>
            
            <Box>
              <Typography variant="h5" component="h1" fontWeight="bold" sx={{ color: '#1a1a1a', mb: 0.5 }}>
                {tokenData.name || 'Unknown Token'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666666' }}>
                {tokenData.symbol || ''}
              </Typography>
            </Box>
          </Box>
          
          {/* Copy Button */}
          {contractAddress && (
            <Tooltip title="Kontrat Adresini Kopyala">
              <IconButton 
                onClick={() => copyToClipboard(contractAddress)}
                sx={{ 
                  color: '#ff7a18',
                  '&:hover': { 
                    backgroundColor: 'rgba(255, 122, 24, 0.1)',
                    color: '#e66a00'
                  }
                }}
              >
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {/* Stats Grid */}
        <Grid container spacing={2}>
          {/* Price */}
          <Grid item xs={6} sm={3}>
            <StatBox>
              <Typography variant="body2" sx={{ color: '#666666', mb: 0.5, fontSize: '0.875rem' }}>
                Price
              </Typography>
              <Typography variant="h6" fontWeight="bold" sx={{ color: '#1a1a1a' }}>
                {formatPrice(tokenData.price)}
              </Typography>
            </StatBox>
          </Grid>
          
          {/* 24h Change */}
          <Grid item xs={6} sm={3}>
            <StatBox>
              <Typography variant="body2" sx={{ color: '#666666', mb: 0.5, fontSize: '0.875rem' }}>
                24h Change
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {isPositive ? (
                  <TrendingUpIcon fontSize="small" sx={{ color: '#10b981' }} />
                ) : (
                  <TrendingDownIcon fontSize="small" sx={{ color: '#ef4444' }} />
                )}
                <Typography 
                  variant="h6" 
                  fontWeight="bold"
                  sx={{ color: isPositive ? '#10b981' : '#ef4444' }}
                >
                  {isPositive ? '+' : ''}{parseFloat(tokenData.priceChange24h || 0).toFixed(2)}%
                </Typography>
              </Box>
            </StatBox>
          </Grid>
          
          {/* Market Cap */}
          <Grid item xs={6} sm={3}>
            <StatBox>
              <Typography variant="body2" sx={{ color: '#666666', mb: 0.5, fontSize: '0.875rem' }}>
                Market Cap
              </Typography>
              <Typography variant="h6" fontWeight="bold" sx={{ color: '#1a1a1a' }}>
                {formatNumber(tokenData.marketCap)}
              </Typography>
            </StatBox>
          </Grid>
          
          {/* 24h Volume */}
          <Grid item xs={6} sm={3}>
            <StatBox>
              <Typography variant="body2" sx={{ color: '#666666', mb: 0.5, fontSize: '0.875rem' }}>
                24h Volume
              </Typography>
              <Typography variant="h6" fontWeight="bold" sx={{ color: '#1a1a1a' }}>
                {formatNumber(tokenData.volume24h)}
              </Typography>
            </StatBox>
          </Grid>
        </Grid>

        {/* Social Links */}
        {(tokenData.website || tokenData.twitter || tokenData.telegram) && (
          <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid rgba(0, 0, 0, 0.06)' }}>
            <Typography variant="body2" sx={{ color: '#666666', mb: 2, fontWeight: 500 }}>
              Social Links
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {tokenData.website && (
                <SocialButton
                  href={tokenData.website.startsWith('http') ? tokenData.website : `https://${tokenData.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<LanguageIcon />}
                  endIcon={<LaunchIcon fontSize="small" />}
                  size="small"
                  colorhue="success"
                >
                  Website
                </SocialButton>
              )}
              {tokenData.twitter && (
                <SocialButton
                  href={tokenData.twitter.startsWith('http') ? tokenData.twitter : `https://twitter.com/${tokenData.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<TwitterIcon />}
                  endIcon={<LaunchIcon fontSize="small" />}
                  size="small"
                  colorhue="info"
                >
                  Twitter
                </SocialButton>
              )}
              {tokenData.telegram && (
                <SocialButton
                  href={tokenData.telegram.startsWith('http') ? tokenData.telegram : `https://t.me/${tokenData.telegram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<TelegramIcon />}
                  endIcon={<LaunchIcon fontSize="small" />}
                  size="small"
                  colorhue="primary"
                >
                  Telegram
                </SocialButton>
              )}
            </Box>
          </Box>
        )}
      </CardContent>
    </TokenCard>
  );
};

export default TokenInfo
