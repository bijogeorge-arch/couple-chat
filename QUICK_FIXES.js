// Add these imports at the top
import { X, Menu, HelpCircle, Loader } from 'lucide-react';
import { PermissionModal, Toast, TutorialOverlay, CinemaModeBadge, MobileMenu } from './UIComponents';

// Add these state variables after line 28
const [permissionError, setPermissionError] = useState(null);
const [toast, setToast] = useState(null);
const [showTutorial, setShowTutorial] = useState(false);
const [showMobileMenu, setShowMobileMenu] = useState(false);
const [isLoadingScreenShare, setIsLoadingScreenShare] = useState(false);
const [isCapturingMemory, setIsCapturingMemory] = useState(false);
