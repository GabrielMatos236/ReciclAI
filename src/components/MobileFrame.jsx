function MobileFrame({ children }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-200 to-green-200 flex items-center justify-center p-4">
            {/* Container Celular */}
            <div className="w-full max-w-[420px] md:h-[850px] md:max-h-[90vh] bg-white md:rounded-[3rem] md:shadow-2xl md:border-8 md:border-gray-900 overflow-hidden relative">
                {/* Conteúdo App */}
                <div className="h-full overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default MobileFrame