import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Shield, AlertCircle, Check } from 'lucide-react';

const RoomPassword = ({ onPasswordSubmit, onSkip, mode = 'create' }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [strength, setStrength] = useState(0);

    const calculatePasswordStrength = (pass) => {
        let score = 0;
        if (pass.length >= 6) score++;
        if (pass.length >= 10) score++;
        if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score++;
        if (/\d/.test(pass)) score++;
        if (/[^a-zA-Z\d]/.test(pass)) score++;
        return score;
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        setStrength(calculatePasswordStrength(newPassword));
        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (mode === 'create') {
            if (password.length < 6) {
                setError('Password must be at least 6 characters');
                return;
            }
            if (password !== confirmPassword) {
                setError('Passwords do not match');
                return;
            }
        }

        if (!password) {
            setError('Please enter a password');
            return;
        }

        onPasswordSubmit(password);
    };

    const getStrengthColor = () => {
        if (strength <= 1) return 'bg-red-500';
        if (strength <= 3) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const getStrengthText = () => {
        if (strength <= 1) return 'Weak';
        if (strength <= 3) return 'Medium';
        return 'Strong';
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-midnight/95 backdrop-blur-xl border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-scale-in">
                {/* Header */}
                <div className="flex items-center justify-center mb-6">
                    <div className="p-4 bg-gradient-to-br from-blush/20 to-lavender/20 rounded-full">
                        <Shield className="w-8 h-8 text-blush" />
                    </div>
                </div>

                <h2 className="text-2xl font-heading font-semibold text-white text-center mb-2">
                    {mode === 'create' ? 'Secure Your Room' : 'Enter Room Password'}
                </h2>
                <p className="text-gray-400 text-sm text-center mb-6">
                    {mode === 'create'
                        ? 'Add an optional password to keep your private space secure'
                        : 'This room is password protected'}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Password Input */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={handlePasswordChange}
                                placeholder="Enter password"
                                className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blush/50 transition-colors"
                                autoFocus
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>

                        {/* Password Strength Indicator (Create Mode) */}
                        {mode === 'create' && password && (
                            <div className="mt-2">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs text-gray-400">Password Strength</span>
                                    <span className={`text-xs font-semibold ${strength <= 1 ? 'text-red-400' :
                                            strength <= 3 ? 'text-yellow-400' :
                                                'text-green-400'
                                        }`}>
                                        {getStrengthText()}
                                    </span>
                                </div>
                                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                                        style={{ width: `${(strength / 5) * 100}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Confirm Password (Create Mode) */}
                    {mode === 'create' && (
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        setError('');
                                    }}
                                    placeholder="Confirm password"
                                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blush/50 transition-colors"
                                />
                                {confirmPassword && password === confirmPassword && (
                                    <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" />
                                )}
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                            <p className="text-sm text-red-300">{error}</p>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-3 pt-2">
                        {mode === 'create' && onSkip && (
                            <button
                                type="button"
                                onClick={onSkip}
                                className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-all duration-300"
                            >
                                Skip
                            </button>
                        )}
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-gradient-to-br from-blush to-lavender hover:shadow-lg rounded-xl text-white font-medium transition-all duration-300 hover:scale-105"
                        >
                            {mode === 'create' ? 'Set Password' : 'Enter Room'}
                        </button>
                    </div>
                </form>

                {/* Security Note */}
                <div className="mt-6 p-3 bg-white/5 rounded-xl">
                    <p className="text-xs text-gray-400 text-center">
                        🔒 Your password is encrypted and never stored on our servers
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RoomPassword;
