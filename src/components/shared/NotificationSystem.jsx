import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  X, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  AlertCircle,
  Mail,
  MessageSquare,
  Settings,
  Volume2,
  VolumeX
} from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Select from '../ui/Select';
import Input from '../ui/Input';
import Modal from '../ui/Modal';
import { useData } from '../../contexts/DataContext';

const NotificationSystem = () => {
  const { notifications, addNotification, removeNotification } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(
    localStorage.getItem('notifications-sound') !== 'false'
  );
  const [emailEnabled, setEmailEnabled] = useState(
    localStorage.getItem('notifications-email') === 'true'
  );
  const [whatsappEnabled, setWhatsappEnabled] = useState(
    localStorage.getItem('notifications-whatsapp') === 'true'
  );
  const [settings, setSettings] = useState({
    criticalRuptures: true,
    stockLevels: true,
    expiringProducts: true,
    pendingOrders: false,
    systemUpdates: false,
    reports: false
  });

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('notification-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('notification-settings', JSON.stringify(settings));
  }, [settings]);

  // Save preferences
  useEffect(() => {
    localStorage.setItem('notifications-sound', soundEnabled.toString());
    localStorage.setItem('notifications-email', emailEnabled.toString());
    localStorage.setItem('notifications-whatsapp', whatsappEnabled.toString());
  }, [soundEnabled, emailEnabled, whatsappEnabled]);

  // Auto-generate notifications based on data patterns
  useEffect(() => {
    const checkForCriticalRuptures = () => {
      // This would be called when new data is loaded
      // For now, we'll simulate some notifications
      if (settings.criticalRuptures) {
        // Check for critical ruptures
        // addNotification({
        //   type: 'critical',
        //   title: 'Ruptura Crítica Detectada',
        //   message: 'Produto XYZ com ruptura total na secção CF',
        //   actions: ['Ver Detalhes', 'Solicitar Compra']
        // });
      }
    };

    // Set up periodic checks
    const interval = setInterval(checkForCriticalRuptures, 300000); // 5 minutes
    return () => clearInterval(interval);
  }, [settings, addNotification]);

  // Play notification sound
  const playNotificationSound = () => {
    if (soundEnabled && 'Audio' in window) {
      // Create a simple beep sound
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    }
  };

  // Send notification via different channels
  const sendNotification = (notification) => {
    // Browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/pwa-192x192.svg',
        badge: '/pwa-192x192.svg'
      });
    }

    // Play sound
    playNotificationSound();

    // Email notification (would integrate with backend)
    if (emailEnabled) {
      // sendEmailNotification(notification);
    }

    // WhatsApp notification (would integrate with WhatsApp Business API)
    if (whatsappEnabled) {
      // sendWhatsAppNotification(notification);
    }

    // Add to internal notifications
    addNotification(notification);
  };

  // Request notification permission
  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  };

  // Get notification icon
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  // Get notification background color
  const getNotificationBg = (type) => {
    switch (type) {
      case 'critical':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Agora mesmo';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}min atrás`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h atrás`;
    return date.toLocaleDateString('pt-PT');
  };

  // Handle notification action
  const handleNotificationAction = (notification, action) => {
    console.log('Notification action:', action, notification);
    // Implement specific actions based on the action type
    removeNotification(notification.id);
  };

  // Predefined notification templates
  const notificationTemplates = [
    {
      type: 'critical',
      title: 'Ruptura Crítica',
      message: 'Produto com ruptura total detectado',
      category: 'criticalRuptures'
    },
    {
      type: 'warning',
      title: 'Stock Baixo',
      message: 'Níveis de stock abaixo do mínimo',
      category: 'stockLevels'
    },
    {
      type: 'info',
      title: 'Produto Expirando',
      message: 'Produtos próximos ao vencimento',
      category: 'expiringProducts'
    },
    {
      type: 'warning',
      title: 'Pedido Pendente',
      message: 'Pedido de compra aguardando aprovação',
      category: 'pendingOrders'
    }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      {/* Notification Bell */}
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="relative p-2"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </div>

      {/* Notification Panel */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Notificações"
        size="md"
      >
        <div className="max-h-96 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {notifications.length} notificação(ões)
              </span>
              {unreadCount > 0 && (
                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                  {unreadCount} não lida(s)
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(true)}
              >
                <Settings className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  notifications.forEach(n => removeNotification(n.id));
                }}
                disabled={notifications.length === 0}
              >
                Limpar Tudo
              </Button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Nenhuma notificação</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border ${getNotificationBg(notification.type)} ${
                    !notification.read ? 'shadow-sm' : 'opacity-75'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {formatTimestamp(notification.timestamp)}
                        </p>
                        
                        {/* Actions */}
                        {notification.actions && notification.actions.length > 0 && (
                          <div className="flex gap-2 mt-2">
                            {notification.actions.map((action, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                onClick={() => handleNotificationAction(notification, action)}
                                className="text-xs"
                              >
                                {action}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeNotification(notification.id)}
                      className="p-1 h-6 w-6"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Test Notifications (Development) */}
          <div className="mt-6 pt-4 border-t">
            <h4 className="text-sm font-medium mb-2">Testar Notificações</h4>
            <div className="grid grid-cols-2 gap-2">
              {notificationTemplates.map((template, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => sendNotification({
                    ...template,
                    message: `${template.message} - Teste ${Date.now()}`,
                    actions: ['Ver Detalhes', 'Ignorar']
                  })}
                  className="text-xs"
                >
                  {template.title}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* Settings Modal */}
      <Modal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        title="Configurações de Notificação"
        size="md"
      >
        <div className="space-y-6">
          {/* Delivery Methods */}
          <div>
            <h4 className="font-medium mb-3">Métodos de Entrega</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {soundEnabled ? (
                    <Volume2 className="w-4 h-4 text-gray-600" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-gray-400" />
                  )}
                  <span>Som</span>
                </div>
                <Button
                  variant={soundEnabled ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                >
                  {soundEnabled ? 'Ativado' : 'Desativado'}
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-600" />
                  <span>Email</span>
                </div>
                <Button
                  variant={emailEnabled ? "default" : "outline"}
                  size="sm"
                  onClick={() => setEmailEnabled(!emailEnabled)}
                >
                  {emailEnabled ? 'Ativado' : 'Desativado'}
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-gray-600" />
                  <span>WhatsApp</span>
                </div>
                <Button
                  variant={whatsappEnabled ? "default" : "outline"}
                  size="sm"
                  onClick={() => setWhatsappEnabled(!whatsappEnabled)}
                >
                  {whatsappEnabled ? 'Ativado' : 'Desativado'}
                </Button>
              </div>
            </div>
          </div>

          {/* Notification Categories */}
          <div>
            <h4 className="font-medium mb-3">Tipos de Notificação</h4>
            <div className="space-y-3">
              {Object.entries(settings).map(([key, enabled]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <Button
                    variant={enabled ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSettings(prev => ({ ...prev, [key]: !enabled }))}
                  >
                    {enabled ? 'Ativado' : 'Desativado'}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Browser Permissions */}
          <div>
            <h4 className="font-medium mb-3">Permissões do Navegador</h4>
            <div className="text-sm text-gray-600 mb-2">
              Status: {
                'Notification' in window 
                  ? Notification.permission === 'granted' 
                    ? 'Permitido' 
                    : Notification.permission === 'denied' 
                      ? 'Negado' 
                      : 'Pendente'
                  : 'Não Suportado'
              }
            </div>
            {Notification.permission !== 'granted' && (
              <Button
                variant="outline"
                size="sm"
                onClick={requestNotificationPermission}
              >
                Solicitar Permissão
              </Button>
            )}
          </div>

          {/* Email Configuration */}
          {emailEnabled && (
            <div>
              <h4 className="font-medium mb-3">Configuração de Email</h4>
              <Input
                placeholder="seu.email@empresa.com"
                defaultValue={localStorage.getItem('notification-email') || ''}
                onChange={(e) => localStorage.setItem('notification-email', e.target.value)}
              />
            </div>
          )}

          {/* WhatsApp Configuration */}
          {whatsappEnabled && (
            <div>
              <h4 className="font-medium mb-3">Configuração do WhatsApp</h4>
              <Input
                placeholder="+351 123 456 789"
                defaultValue={localStorage.getItem('notification-whatsapp') || ''}
                onChange={(e) => localStorage.setItem('notification-whatsapp', e.target.value)}
              />
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default NotificationSystem;
