import React, { useState, useEffect, useRef } from 'react';
import { styled, alpha } from '@mui/material/styles';
import { 
  Box, 
  TextField, 
  InputAdornment, 
  IconButton, 
  CircularProgress, 
  Paper, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Typography,
  Fade,
  ClickAwayListener,
  useTheme,
  Button,
  Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import HistoryIcon from '@mui/icons-material/History';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

// Google-like search bar

const StyledSearch = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  maxWidth: 600,
  margin: '0 auto',
}));

// Google-like search input
const SearchInput = styled(TextField)(({ theme }) => ({
  width: '100%',
  '& .MuiOutlinedInput-root': {
    borderRadius: 18,
    background: theme.palette.mode === 'dark' 
      ? 'linear-gradient(135deg, rgba(20,20,20,0.92) 0%, rgba(5,5,5,0.92) 100%)'
      : '#ffffff',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 12px 30px rgba(255, 122, 24, 0.22)'
      : '0 2px 12px rgba(0, 0, 0, 0.15)',
    transition: 'all 0.2s ease',
    '&:hover': {
      boxShadow: theme.palette.mode === 'dark'
        ? '0 18px 40px rgba(255, 122, 24, 0.26)'
        : '0 4px 20px rgba(0, 0, 0, 0.2)',
    },
    '&.Mui-focused': {
      boxShadow: theme.palette.mode === 'dark'
        ? `0 0 0 3px ${alpha(theme.palette.primary.main, 0.3)}`
        : `0 4px 20px ${alpha(theme.palette.primary.main, 0.25)}`,
    },
    '& fieldset': {
      border: 'none',
    },
  },
  '& .MuiInputBase-input': {
    padding: '18px 22px',
    fontSize: '1.05rem',
  },
}));

const SearchResults = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  top: 'calc(100% + 8px)',
  left: 0,
  right: 0,
  zIndex: 10,
  borderRadius: 16,
  boxShadow: '0 12px 36px rgba(255, 122, 24, 0.2)',
  maxHeight: 350,
  overflow: 'auto',
  border: 'none',
  backgroundColor: theme.palette.mode === 'dark' 
    ? 'rgba(15, 15, 15, 0.94)'
    : 'rgba(255, 255, 255, 0.98)',
  backdropFilter: 'blur(8px)',
  '&::-webkit-scrollbar': {
    width: 6,
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  '&::-webkit-scrollbar-thumb': {
    background: alpha(theme.palette.primary.main, 0.8),
    borderRadius: 10,
  },
}));

const SearchBar = ({ onSearch, isLoading, searchQuery, setSearchQuery, placeholder = "Enter token name or contract address..." }) => {
  const [recentSearches, setRecentSearches] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  const theme = useTheme();

  // Load recent searches from localStorage
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  // Save search to recent searches
  const saveSearch = (searchTerm) => {
    const updatedSearches = [
      searchTerm,
      ...recentSearches.filter(item => item !== searchTerm)
    ].slice(0, 5); // Keep max 5 recent searches
    
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() && !isLoading) {
      const searchTerm = searchQuery.trim();
      saveSearch(searchTerm);
      onSearch(searchTerm);
      setShowSuggestions(false);
    }
  };

  const handleSearchClick = (searchTerm) => {
    setSearchQuery(searchTerm);
    saveSearch(searchTerm);
    onSearch(searchTerm);
    setShowSuggestions(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };
  
  const handleSearch = (searchTerm) => {
    if (searchTerm.trim() && !isLoading) {
      saveSearch(searchTerm);
      onSearch(searchTerm);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    saveSearch(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  const popularTokens = [
    { name: 'BTC', hot: true },
    { name: 'ETH', hot: true },
    { name: 'SOL', hot: true },
    { name: 'AVAX', hot: false },
    { name: 'DOGE', hot: false },
    { name: 'PEPE', hot: true }
  ];

  return (
    <ClickAwayListener onClickAway={() => setShowSuggestions(false)}>
      <StyledSearch ref={searchRef}>
        <Box 
          component="form" 
          onSubmit={handleSubmit}
          sx={{
            position: 'relative',
            width: '100%',
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            disabled={isLoading}
            InputProps={{
              sx: {
                borderRadius: 3,
                bgcolor: theme.palette.mode === 'dark' 
                  ? alpha(theme.palette.background.paper, 0.8)
                  : alpha(theme.palette.background.paper, 0.95),
                backdropFilter: 'blur(8px)',
                boxShadow: theme.shadows[1],
                '&:hover': {
                  boxShadow: theme.shadows[2],
                },
                '&.Mui-focused': {
                  boxShadow: `0 0 0 2px ${theme.palette.primary.main}40`,
                },
                pr: 1,
                height: 60,
                transition: 'all 0.3s ease',
              },
              startAdornment: (
                <InputAdornment position="start" sx={{ ml: 1.5, color: 'text.secondary' }}>
                  {isLoading ? (
                    <CircularProgress size={24} color="primary" />
                  ) : (
                    <SearchIcon fontSize="medium" color="primary" />
                  )}
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    type="submit"
                    disabled={isLoading || !searchQuery.trim()}
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      borderRadius: 2,
                      p: 1.5,
                      '&:hover': {
                        bgcolor: 'primary.dark',
                        transform: 'translateX(2px)',
                      },
                      '&:disabled': {
                        bgcolor: 'action.disabledBackground',
                        color: 'action.disabled',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <ArrowForwardIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Search suggestions */}
        <Fade in={showSuggestions}>
          <SearchResults elevation={4}>
            {recentSearches.length > 0 && (
              <>
                <ListItem 
                  sx={{
                    py: 1,
                    px: 2,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <HistoryIcon fontSize="small" color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Typography variant="subtitle2" fontWeight={600}>
                        Recent Searches
                      </Typography>
                    } 
                  />
                </ListItem>
                {recentSearches.map((search, index) => (
                  <ListItemButton 
                    key={index} 
                    onClick={() => handleSuggestionClick(search)}
                    sx={{
                      py: 1.5,
                      '&:hover': {
                        bgcolor: theme.palette.mode === 'dark' 
                          ? alpha(theme.palette.primary.main, 0.1)
                          : alpha(theme.palette.primary.main, 0.05),
                      }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36, color: 'text.secondary' }}>
                      <HistoryIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={search} />
                  </ListItemButton>
                ))}
              </>
            )}

            {/* Popüler Tokenlar */}
            <ListItem 
              sx={{
                py: 1,
                px: 2,
                borderTop: recentSearches.length > 0 ? `1px solid ${theme.palette.divider}` : 'none',
                borderBottom: `1px solid ${theme.palette.divider}`,
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <TrendingUpIcon fontSize="small" color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary={
                  <Typography variant="subtitle2" fontWeight={600}>
                    Popular Tokens
                  </Typography>
                } 
              />
            </ListItem>
            <Box sx={{ p: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {popularTokens.map((token) => (
                <Chip
                  key={token.name}
                  label={token.name}
                  onClick={() => handleSearchClick(token.name)}
                  color={token.hot ? "secondary" : "default"}
                  icon={token.hot ? <LocalFireDepartmentIcon /> : <TrendingUpIcon />}
                  variant={token.hot ? "filled" : "outlined"}
                  sx={{
                    borderRadius: 3,
                    px: 1,
                    fontWeight: 500,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 2,
                    },
                    transition: 'all 0.2s ease',
                  }}
                />
              ))}
            </Box>
          </SearchResults>
        </Fade>
      </StyledSearch>
    </ClickAwayListener>
  );
};

export default SearchBar;
