import { Assessment, ExpandLess, ExpandMore, Settings } from '@mui/icons-material';
import {
  AppBar,
  Avatar,
  Box,
  Collapse,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem as MI,
  Paper,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';

import BaseInformation from '../scale-base-information';
import HOME from '../user/index';

type MenuItem = {
  text: string;
  icon: JSX.Element;
  submenus?: SubMenuItem[];
  auth: string[];
};

type SubMenuItem = {
  text: string;
  component?: JSX.Element;
};

const menuItems: MenuItem[] = [
  {
    text: '量表管理（参考）',
    icon: <Assessment />,
    submenus: [{ text: '量表基本信息', component: <BaseInformation /> }],
    auth: ['ADMIN', 'DIRECTIOR', 'DOCTOR'],
  },
  {
    text: '基础设置（练习）',
    icon: <Settings />,
    submenus: [{ text: '用户管理', component: <HOME /> }],
    auth: ['ADMIN', 'DIRECTIOR', 'DOCTOR'],
  },
];

export const Sidebar: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activeSubMenuIndex, setActiveSubMenuIndex] = useState<number | null>(null);
  const [userMenu, setUserMenu] = useState<boolean>(false);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const currentUserType = 'ADMIN';
  const handleClick = (index: number) => {
    setActiveSubMenuIndex(null);
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleSubMenuClick = (index: number) => {
    setActiveSubMenuIndex(index);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
    setUserMenu(true);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
    setUserMenu(false);
  };

  const handleExit = () => {
    localStorage.setItem('accessToken', '');
    localStorage.setItem('refreshToken', '');
    localStorage.setItem('role', '');
    localStorage.setItem('username', '');
    setTimeout(() => {
      window.location.href = '/login';
    }, 200);
  };

  const renderSubMenu = () => {
    if (activeIndex === null) {
      return null;
    }
    const activeMenuItem = menuItems[activeIndex];
    if (activeMenuItem.submenus && activeMenuItem.submenus.length > 0) {
      return (
        <List>
          {activeMenuItem.submenus.map((submenu, index) => (
            <ListItem
              button
              key={index}
              onClick={() => handleSubMenuClick(index)}
              sx={{
                backgroundColor: activeSubMenuIndex === index ? '#e6e6e6' : 'inherit',
                color: activeSubMenuIndex === index ? '#1ca49c' : 'gray',
              }}
            >
              <ListItemText sx={{ textAlign: 'center' }} primary={submenu.text} />
            </ListItem>
          ))}
        </List>
      );
    }
    return null;
  };

  const renderContent = () => {
    if (activeSubMenuIndex === null) {
      return null;
    }
    const activeMenuItem = menuItems[activeIndex!];
    const activeSubMenu = activeMenuItem.submenus![activeSubMenuIndex];
    return activeSubMenu.component;
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: 'green' }}>
        <Toolbar>
          <Box
            sx={{
              marginLeft: 'auto',
              marginRight: '20px',
            }}
          >
            <Tooltip title="">
              <IconButton onClick={handleOpenUserMenu} sx={{ borderRadius: '5px' }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                  // onClick={handleOpenUserMenu}
                >
                  <Avatar alt="Remy Sharp" src="/src/assets/top_touxiang@2x.png" />
                  <Typography
                    sx={{ marginLeft: '8px', fontSize: '14px', color: 'white' }}
                  >
                    你好,ADMIN
                  </Typography>
                </Box>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '50px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 10,
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 145,
              }}
              open={userMenu}
              onClose={handleCloseUserMenu}
            >
              <MI
                onClick={handleExit}
                sx={{
                  width: '160px',
                  height: '28px',
                  gap: '8px',
                  ':hover': {
                    backgroundColor: 'rgba(3,138,151,0.08)', // 修改背景颜色
                    color: '#038A97',
                  },
                }}
                onMouseEnter={() => {
                  document
                    .querySelector('#menu-exit')
                    ?.setAttribute('src', '/src/assets/tuichu_selected.png');
                }}
                onMouseLeave={() => {
                  document
                    .querySelector('#menu-exit')
                    ?.setAttribute('src', '/src/assets/tuichu.png');
                }}
              >
                <img id="menu-exit" src="/src/assets/tuichu.png" />
                <Typography textAlign="center" sx={{ fontSize: '12px' }}>
                  退出/切换
                </Typography>
              </MI>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: 'flex' }}>
        <Drawer
          variant="permanent"
          sx={{
            display: 'flex',
            width: 240,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 240,
              boxSizing: 'border-box',
              backgroundColor: 'white',
            },
          }}
        >
          <Toolbar
            sx={{ backgroundColor: 'green', color: 'white', justifyContent: 'center' }}
          >
            培训练习框架
          </Toolbar>
          <List>
            {menuItems.map((item, index) => {
              if (item.auth.includes(currentUserType))
                return (
                  <div key={index}>
                    <ListItem button onClick={() => handleClick(index)}>
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText
                        primary={item.text}
                        sx={{
                          color: activeIndex === index ? '#1ca49c' : 'gray',
                        }}
                      />
                      {item.submenus &&
                        (activeIndex === index ? <ExpandLess /> : <ExpandMore />)}
                    </ListItem>
                    {item.submenus && activeIndex === index && (
                      <Collapse in={true} timeout="auto" unmountOnExit>
                        {renderSubMenu()}
                      </Collapse>
                    )}
                  </div>
                );
            })}
          </List>
        </Drawer>
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Paper sx={{ height: 'calc(100vh - 112px)', overflow: 'auto' }}>
            {renderContent()}
          </Paper>
        </Box>
      </Box>
    </>
  );
};
