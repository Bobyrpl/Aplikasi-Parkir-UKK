import { Link } from 'react-router-dom';
import { PageHeader, Card, Button } from '../../components/ui';

export default function DashboardOwner() {
    return (
        <div>
            <PageHeader
                eyebrow="PANEL OWNER"
                title="Ringkasan Usaha"
                description="Lihat performa pendapatan parkir kapan saja."
            />

            <Card className="p-6 max-w-lg">
                <h2 className="font-display text-lg text-[#EDEFF2] mb-2">Rekap Transaksi</h2>
                <p className="text-sm text-[#8B94A3] mb-4">
                    Pilih rentang tanggal untuk melihat jumlah transaksi dan
                    total pendapatan pada periode tersebut.
                </p>
                <Link to="/owner/rekap">
                    <Button>Buka Rekap Transaksi</Button>
                </Link>
            </Card>
        </div>
    );
}
