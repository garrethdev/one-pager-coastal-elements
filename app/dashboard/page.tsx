'use client';

import React, { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { useRouter } from 'next/navigation';

const AVAILABLE_PLANS = [
  {
    id: 'starter-plan',
    name: 'Starter Plan',
    price: '$15.00 / month',
    description: 'Entry tier for individual agents and trials.',
  },
  {
    id: 'pro-plan',
    name: 'Pro Plan',
    price: '$25.00 / month',
    description: 'Unlock advanced exports and higher limits.',
  },
  {
    id: 'custom',
    name: 'Other Plan ID',
    price: 'Custom',
    description: 'Use a manual plan ID if you created a different plan.',
  },
];

const formatDateTime = (value?: string | null) => {
  if (!value) {
    return '—';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString();
};

function DashboardContent() {
  const {
    user,
    profile,
    logout,
    subscribeToPlan,
    cancelSubscription,
    refreshProfile,
    attachTestPaymentMethod,
  } = useAuth();
  const router = useRouter();

  const [selectedPlan, setSelectedPlan] = useState<string>(
    AVAILABLE_PLANS[0]?.id ?? '',
  );
  const [customPlanId, setCustomPlanId] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState<
    { type: 'success' | 'error'; message: string } | null
  >(null);

  const activePlanId = profile?.plan_id ?? null;
  const planStatus = profile?.status ?? null;
  const isAutoRenew = profile?.auto_renews ?? null;
  const periodEnd = formatDateTime(profile?.period_end ?? null);
  const cancelAt = formatDateTime(profile?.cancel_period_at ?? null);

  const planOptions = useMemo(() => {
    const base = AVAILABLE_PLANS.map((plan) => ({
      ...plan,
      isActive: plan.id === activePlanId,
    }));

    if (activePlanId && !base.some((plan) => plan.id === activePlanId)) {
      base.unshift({
        id: activePlanId,
        name: activePlanId,
        price: '',
        description: 'Current plan detected from profile',
        isActive: true,
      });
    }

    return base;
  }, [activePlanId]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const handleSubscribe = async () => {
    const isCustom = selectedPlan === 'custom';
    const planId = (isCustom ? customPlanId : selectedPlan).trim();

    if (!planId) {
      setFeedback({
        type: 'error',
        message: isCustom
          ? 'Please provide an item price ID.'
          : 'Please select a plan.',
      });
      return;
    }
    setIsProcessing(true);
    setFeedback(null);
    const result = await subscribeToPlan(planId);
    if (result.success) {
      setFeedback({
        type: 'success',
        message: `Subscription created for ${planId}.`,
      });
      setCustomPlanId('');
      await refreshProfile();
    } else {
      setFeedback({
        type: 'error',
        message: result.error || 'Failed to create subscription.',
      });
    }
    setIsProcessing(false);
  };

  const handleCancel = async () => {
    setIsProcessing(true);
    setFeedback(null);
    const result = await cancelSubscription();
    if (result.success) {
      setFeedback({
        type: 'success',
        message: 'Subscription cancellation scheduled.',
      });
      await refreshProfile();
    } else {
      setFeedback({
        type: 'error',
        message: result.error || 'Failed to cancel subscription.',
      });
    }
    setIsProcessing(false);
  };

  const handleAttachTestCard = async () => {
    setIsProcessing(true);
    setFeedback(null);
    const result = await attachTestPaymentMethod();
    if (result.success) {
      setFeedback({
        type: 'success',
        message:
          'Test payment method attached. You can now create a subscription.',
      });
      await refreshProfile();
    } else {
      setFeedback({
        type: 'error',
        message: result.error || 'Failed to attach test payment method.',
      });
    }
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Realtor AI Dashboard
            </h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Welcome! 🎉
          </h2>
          <p className="text-gray-600">
            You have successfully logged in using OTP authentication.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            User Information
          </h3>
          <div className="space-y-3">
            <InfoRow label="Email" value={user?.email ?? '—'} />
            <InfoRow
              label="User ID"
              value={user ? `${user.id.slice(0, 8)}…` : '—'}
            />
            <InfoRow label="Token Type" value={user?.token_type ?? '—'} />
            <InfoRow
              label="Chargebee Customer ID"
              value={profile?.chargebee_customer_id ?? '—'}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Account Snapshot
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SnapshotTile
              title="Credits"
              value={profile?.current_credits?.toString() ?? '0'}
              accent="text-green-600"
            />
            <SnapshotTile
              title="Member Since"
              value={
                profile?.created_at
                  ? new Date(profile.created_at).toLocaleDateString()
                  : '—'
              }
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">
              Subscription Management
            </h3>
            {feedback ? (
              <span
                className={`text-sm font-medium ${
                  feedback.type === 'success'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {feedback.message}
              </span>
            ) : null}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <InfoRow label="Active Plan ID" value={activePlanId ?? '—'} />
              <InfoRow label="Plan Name" value={profile?.plan_name ?? '—'} />
              <InfoRow label="Status" value={planStatus ?? '—'} />
              <InfoRow
                label="Auto-renews"
                value={
                  isAutoRenew === null
                    ? '—'
                    : isAutoRenew
                    ? 'Yes'
                    : 'No (will not renew)'
                }
              />
              <InfoRow label="Current Period Ends" value={periodEnd} />
              <InfoRow label="Cancel at Period End" value={cancelAt} />
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Select a plan
                </h4>
                <div className="space-y-2">
                  {planOptions.map((plan) => (
                    <label
                      key={plan.id}
                      className={`flex items-start space-x-3 border rounded-lg p-3 cursor-pointer hover:border-blue-400 ${
                        selectedPlan === plan.id && !customPlanId
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="plan"
                        value={plan.id}
                        checked={selectedPlan === plan.id && !customPlanId}
                        onChange={() => setSelectedPlan(plan.id)}
                        className="mt-1"
                      />
                      <div>
                        <div className="font-semibold text-gray-900 flex items-center space-x-2">
                          <span>{plan.name}</span>
                          {plan.isActive ? (
                            <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                              Current
                            </span>
                          ) : null}
                        </div>
                        <p className="text-sm text-gray-600">{plan.price}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {plan.description}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleAttachTestCard}
                  disabled={isProcessing}
                  className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-900 disabled:bg-gray-400 text-white font-semibold rounded-lg transition"
                >
                  {isProcessing ? 'Processing…' : 'Attach Chargebee Test Card'}
                </button>
                <p className="text-xs text-gray-500">
                  Chargebee requires a payment method per customer even in the
                  sandbox. This button attaches the default test card
                  (4111&nbsp;1111&nbsp;1111&nbsp;1111) so you can create
                  subscriptions from the app.
                </p>
                <label
                  htmlFor="custom-plan-id"
                  className="text-sm font-medium text-gray-700"
                >
                  Custom plan ID (optional)
                </label>
                <input
                  id="custom-plan-id"
                  type="text"
                  value={customPlanId}
                  onChange={(event) => setCustomPlanId(event.target.value)}
                  placeholder="Enter Chargebee plan ID"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
                <p className="text-xs text-gray-500">
                  Leave empty to use the selected plan above. Supply a Chargebee
                  plan ID if you created a different plan in your sandbox.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-2 sm:space-y-0">
                <button
                  onClick={handleSubscribe}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold rounded-lg transition"
                >
                  {isProcessing ? 'Processing…' : 'Subscribe'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isProcessing || !activePlanId}
                  className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-800 font-semibold rounded-lg transition"
                >
                  {isProcessing ? 'Processing…' : 'Cancel at period end'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => router.push('/search')}
            className="bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 hover:border-blue-300 rounded-lg p-6 transition text-left"
          >
            <div className="text-4xl mb-2">🔍</div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Search Properties
            </h4>
            <p className="text-sm text-gray-600">
              Search through millions of properties with AI-powered insights.
            </p>
            <p className="text-xs text-blue-600 mt-3 font-semibold">
              Click to start searching →
            </p>
          </button>

          <button
            onClick={() => router.push('/saved-searches')}
            className="bg-green-50 hover:bg-green-100 border-2 border-green-200 hover:border-green-300 rounded-lg p-6 transition text-left"
          >
            <div className="text-4xl mb-2">💾</div>
            <h4 className="font-semibold text-gray-900 mb-2">Saved Searches</h4>
            <p className="text-sm text-gray-600">
              Save your favorite searches and get instant updates.
            </p>
            <p className="text-xs text-green-600 mt-3 font-semibold">
              View saved searches →
            </p>
          </button>

          <button
            onClick={() => router.push('/search')}
            className="bg-purple-50 hover:bg-purple-100 border-2 border-purple-200 hover:border-purple-300 rounded-lg p-6 transition text-left"
          >
            <div className="text-4xl mb-2">📊</div>
            <h4 className="font-semibold text-gray-900 mb-2">Export Data</h4>
            <p className="text-sm text-gray-600">
              Export search results to CSV for deeper analysis.
            </p>
            <p className="text-xs text-purple-600 mt-3 font-semibold">
              Search then export →
            </p>
          </button>
        </div>
      </main>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b pb-2">
      <span className="font-medium text-gray-700">{label}:</span>
      <span className="text-gray-900 text-right break-all">{value}</span>
    </div>
  );
}

function SnapshotTile({
  title,
  value,
  accent,
}: {
  title: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <h4 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
        {title}
      </h4>
      <p className={`mt-2 text-2xl font-bold ${accent ?? 'text-gray-900'}`}>
        {value}
      </p>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

