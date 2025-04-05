import React from 'react';
import { Box, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';
import './Dock.css';

const DockItem = ({ icon, label, onClick, isActive }) => {
  return (
    <Tooltip title={label} placement="top" arrow>
      <motion.div
        className={`dock-item ${isActive ? 'active-dock-item' : ''}`}
        whileHover={{ 
          y: -10,
          scale: 1.1,
          transition: { type: 'spring', stiffness: 300, damping: 15 }
        }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
      >
        <div className="dock-icon">{icon}</div>
      </motion.div>
    </Tooltip>
  );
};

const Dock = ({ items }) => {
  return (
    <Box className="dock-container">
      <motion.div
        className="dock-panel"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ 
          type: 'spring', 
          stiffness: 260, 
          damping: 20, 
          delay: 0.1 
        }}
      >
        {items.map((item, index) => (
          <DockItem
            key={index}
            icon={item.icon}
            label={item.label}
            onClick={item.onClick}
            isActive={item.className.includes('active')}
          />
        ))}
      </motion.div>
    </Box>
  );
};

export default Dock;