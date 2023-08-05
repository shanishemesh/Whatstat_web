import { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import DashboardCustomizeRoundedIcon from '@mui/icons-material/DashboardCustomizeRounded';
import PermPhoneMsgRoundedIcon from '@mui/icons-material/PermPhoneMsgRounded';
import MessageRoundedIcon from '@mui/icons-material/MessageRounded';
import Diversity1RoundedIcon from '@mui/icons-material/Diversity1Rounded';
import AdUnitsRoundedIcon from '@mui/icons-material/AdUnitsRounded';
import AodRoundedIcon from '@mui/icons-material/AodRounded';
import LiveHelpRoundedIcon from '@mui/icons-material/LiveHelpRounded';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';


const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Home");

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "6px 15px 6px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">

          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "5px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[150]}>
                Whatstat
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="20px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={`../../assets/user.png`}
                  style={{ cursor: "pointer", borderRadius: "100%" }}/>
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "5px 0 0 0" }}>
                </Typography>
                <Typography variant="h5" color={colors.greenAccent[500]}>
                Statistical analysis for my group {<PermPhoneMsgRoundedIcon/>}
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "15%"}>
            <Item
              title="Home"
              to="/"
              icon={<HomeRoundedIcon/>}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Dashboard"
              to="/dashboard"
              icon={<DashboardCustomizeRoundedIcon/>}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h5"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 15px" }}
            >
              Analysis
            </Typography>
            <Item
              title="Text Analysis"
              to="/analysis"
              icon={<MessageRoundedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Time Analysis"
              to="/timeAnalysis"
              icon={<AccessAlarmIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Relationship Analysis"
              to="/relashionsAnalysis"
              icon={<Diversity1RoundedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant="h5"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 15px" }}
            >
              User survey
            </Typography>
            <Item
              title="Survey"
              to="/survey"
              icon={<LiveHelpRoundedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
